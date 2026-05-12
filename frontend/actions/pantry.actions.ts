"use server";

import { checkUser } from "@/lib/checkUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { freePantryScans, proTierLimit } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface PantryIngredient {
    name: string;
    quantity: string;
    confidence?: number;
}

interface PantryItem {
    id: number;
    attributes: {
        name: string;
        quantity: string;
        imageUrl?: string;
        owner?: number;
        createdAt?: string;
        updatedAt?: string;
    };
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface ScanResponse {
    success: boolean;
    ingredients: PantryIngredient[];
    scansLimit: string | number;
    message: string;
}

interface PantryResponse {
    success: boolean;
    items: PantryItem[];
    scansLimit: string | number;
}

interface SavePantryResponse {
    success: boolean;
    savedItems: PantryItem[];
    message: string;
}

interface UpdateResponse {
    success: boolean;
    item: PantryItem;
    message: string;
}

// Scan image with Gemini Vision
export async function scanPantryImage(
    formData: FormData
): Promise<ScanResponse> {
    try {
        const user = await checkUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const isPro = user.subscriptionTier === "pro";

        const arcjetClient = isPro ? proTierLimit : freePantryScans;

        const req = await request();

        const decision = await arcjetClient.protect(req, {
            userId: user.clerkId,
            requested: 1,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                throw new Error(
                    `Monthly scan limit reached. ${isPro
                        ? "Please contact support if you need more scans."
                        : "Upgrade to Pro for unlimited scans!"
                    }`
                );
            }

            throw new Error("Request denied by security system");
        }

        const imageFile = formData.get("image") as File | null;

        if (!imageFile) {
            throw new Error("No image provided");
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString("base64");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
        });

        const prompt = `
      You are a professional chef and ingredient recognition expert.
      Analyze this image of a pantry/fridge and identify all visible food ingredients.

      Return ONLY a valid JSON array with this exact structure:
      [
        {
          "name": "ingredient name",
          "quantity": "estimated quantity with unit",
          "confidence": 0.95
        }
      ]

      Rules:
      - Only identify food ingredients
      - Be specific
      - Estimate realistic quantities
      - Confidence should be 0.7-1.0
      - Maximum 20 items
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: imageFile.type,
                    data: base64Image,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        let ingredients: PantryIngredient[];

        try {
            const cleanText = text
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();

            ingredients = JSON.parse(cleanText) as PantryIngredient[];
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            throw new Error("Failed to parse ingredients. Please try again.");
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            throw new Error(
                "No ingredients detected in the image. Please try a clearer photo."
            );
        }

        return {
            success: true,
            ingredients: ingredients.slice(0, 20),
            scansLimit: isPro ? "unlimited" : 10,
            message: `Found ${ingredients.length} ingredients!`,
        };
    } catch (error) {
        console.error("Error scanning pantry:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to scan image"
        );
    }
}

// Save ingredients to pantry
export async function saveToPantry(
    formData: FormData
): Promise<SavePantryResponse> {
    try {
        const user = await checkUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const ingredientsJson = formData.get("ingredients") as string;

        const ingredients: PantryIngredient[] = JSON.parse(ingredientsJson);

        if (!ingredients || ingredients.length === 0) {
            throw new Error("No ingredients to save");
        }

        const savedItems: PantryItem[] = [];

        for (const ingredient of ingredients) {
            const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({
                    data: {
                        name: ingredient.name,
                        quantity: ingredient.quantity,
                        imageUrl: "",
                        owner: user.id,
                    },
                }),
            });

            if (response.ok) {
                const data = await response.json();
                savedItems.push(data.data);
            }
        }

        return {
            success: true,
            savedItems,
            message: `Saved ${savedItems.length} items to your pantry!`,
        };
    } catch (error) {
        console.error("Error saving to pantry:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to save items"
        );
    }
}

// Add pantry item manually
export async function addPantryItemManually(
    formData: FormData
): Promise<UpdateResponse> {
    try {
        const user = await checkUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const name = formData.get("name") as string;
        const quantity = formData.get("quantity") as string;

        if (!name || !quantity) {
            throw new Error("Name and quantity are required");
        }

        const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    name: name.trim(),
                    quantity: quantity.trim(),
                    imageUrl: "",
                    owner: user.id,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to add item:", errorText);

            throw new Error("Failed to add item to pantry");
        }

        const data = await response.json();

        return {
            success: true,
            item: data.data,
            message: "Item added successfully!",
        };
    } catch (error) {
        console.error("Error adding item manually:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to add item"
        );
    }
}

// Get user's pantry items
export async function getPantryItems(): Promise<PantryResponse> {
    try {
        const user = await checkUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const response = await fetch(
            `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}&sort=createdAt:desc`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch pantry items");
        }

        const data = await response.json();

        const isPro = user.subscriptionTier === "pro";

        return {
            success: true,
            items: data.data || [],
            scansLimit: isPro ? "unlimited" : 10,
        };
    } catch (error) {
        console.error("Error fetching pantry:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to load pantry"
        );
    }
}

// Delete pantry item
export async function deletePantryItem(
    formData: FormData
): Promise<ApiResponse<null>> {
    try {
        const user = await checkUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const itemId = formData.get("itemId") as string;

        const response = await fetch(
            `${STRAPI_URL}/api/pantry-items/${itemId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete item");
        }

        return {
            success: true,
            message: "Item removed from pantry",
        };
    } catch (error) {
        console.error("Error deleting item:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to delete item"
        );
    }
}

// Update pantry item
export async function updatePantryItem(
    formData: FormData
): Promise<UpdateResponse> {
    try {
        const user = await checkUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const itemId = formData.get("itemId") as string;
        const name = formData.get("name") as string;
        const quantity = formData.get("quantity") as string;

        const response = await fetch(
            `${STRAPI_URL}/api/pantry-items/${itemId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({
                    data: {
                        name,
                        quantity,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update item");
        }

        const data = await response.json();

        return {
            success: true,
            item: data.data,
            message: "Item updated successfully",
        };
    } catch (error) {
        console.error("Error updating item:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to update item"
        );
    }
}
