/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import useFetch from "@/hooks/use-fetch";
import {
    scanPantryImage,
    saveToPantry,
    addPantryItemManually,
} from "@/actions/pantry.actions";
import { toast } from "sonner";

export default function AddToPantryModal({ isOpen, onClose, onSuccess } : any) {
    const [activeTab, setActiveTab] = useState<any>("scan");
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [scannedIngredients, setScannedIngredients] = useState<any>([]);
    const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

    // Scan image
    const {
        loading: scanning,
        data: scanData,
        fn: scanImage,
    } = useFetch(scanPantryImage);

    // Save scanned items
    const {
        loading: saving,
        data: saveData,
        fn: saveScannedItems,
    } = useFetch(saveToPantry);

    // Add manual item
    const {
        loading: adding,
        data: addData,
        fn: addManualItem,
    } = useFetch(addPantryItemManually);

    // Handle image selection
    const handleImageSelect = (file : any) => {
        setSelectedImage(file);
        setScannedIngredients([]); // Reset when new image selected
    };

    // Scan image
    const handleScan = async () => {
        if (!selectedImage) return;
        const formData = new FormData();
        formData.append("image", selectedImage);
        await scanImage(formData);
    };

    // Update scanned ingredients when scan completes
    useEffect(() => {
        if (scanData?.success && scanData?.ingredients) {
            setScannedIngredients(scanData?.ingredients);
            toast.success(`Found ${scanData.ingredients.length} ingredients!`);
        }
    }, [scanData]);

    // Handle save scanned items
    const handleSaveScanned = async () => {
        if (scannedIngredients.length === 0) {
            toast.error("No ingredients to save");
            return;
        }

        const formData = new FormData();
        formData.append("ingredients", JSON.stringify(scannedIngredients));
        await saveScannedItems(formData);
    };

    // Reset modal state
    const handleClose = () => {
        setActiveTab("scan");
        setSelectedImage(null);
        setScannedIngredients([]);
        setManualItem({ name: "", quantity: "" });
        onClose();
    };

    // Handle save success
    useEffect(() => {
        if (saveData?.success) {
            toast.success(saveData.message);
            handleClose();
            if (onSuccess) onSuccess();
        }
    }, [saveData]);

    // Handle manual add
    const handleAddManual = async (e : any) => {
        e.preventDefault();
        if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", manualItem.name);
        formData.append("quantity", manualItem.quantity);
        await addManualItem(formData);
    };

    // Handle manual add success
    useEffect(() => {
        if (addData?.success) {
            toast.success("Item added to pantry!");
            setManualItem({ name: "", quantity: "" });
            handleClose();
            if (onSuccess) onSuccess();
        }
    }, [addData]);

    // Remove scanned ingredient
    const removeIngredient = (index: number) => {
        setScannedIngredients(scannedIngredients?.filter((_ : any, i : number) => i !== index));
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="
            w-[95vw]
            sm:max-w-2xl
            lg:max-w-3xl
            max-h-[95dvh]
            p-0
            gap-0
            overflow-hidden
            rounded-xl
        "
            >
                <div className="flex flex-col h-full max-h-[95dvh] ">
                    {/* Header */}
                    <DialogHeader className="px-4 sm:px-6 py-4 border-b shrink-0">
                        <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                            Add to Pantry
                        </DialogTitle>

                        <DialogDescription className="text-sm sm:text-base">
                            Scan your pantry with AI or add items manually
                        </DialogDescription>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full flex flex-col"
                        >
                            <TabsList className="grid w-full grid-cols-2 h-11">
                                <TabsTrigger value="scan" className="gap-2
                                            rounded-lg
                                            text-stone-600
                                            transition-all
                                            data-[state=active]:bg-white
                                            data-[state=active]:text-orange-600
                                            data-[state=active]:shadow-sm
                                ">
                                    <Camera className="w-4 h-4" />
                                    AI Scan
                                </TabsTrigger>

                                <TabsTrigger value="manual" className=" gap-2
                                            rounded-lg
                                            text-stone-600
                                            transition-all
                                            data-[state=active]:bg-white
                                            data-[state=active]:text-orange-600
                                            data-[state=active]:shadow-sm">
                                    <Plus className="w-4 h-4" />
                                    Add Manually
                                </TabsTrigger>
                            </TabsList>

                            {/* AI Scan Tab */}
                            <TabsContent value="scan" className="space-y-2 mt-4">
                                {scannedIngredients.length === 0 ? (
                                    <div className="space-y-4">
                                        <ImageUploader
                                            onImageSelect={handleImageSelect}
                                            loading={scanning}
                                        />

                                        {selectedImage && (
                                            <Button
                                                onClick={handleScan}
                                                className="w-full bg-orange-600 cursor-pointer hover:bg-orange-700 text-white h-11 sm:h-12"
                                                disabled={scanning}
                                            >
                                                {scanning ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Camera className="w-5 h-5 mr-2" />
                                                        Scan Image
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-stone-900">
                                                    Review Detected Items
                                                </h3>

                                                <p className="text-sm text-stone-600">
                                                    Found {scannedIngredients.length} ingredients
                                                </p>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setScannedIngredients([]);
                                                    setSelectedImage(null);
                                                }}
                                                className="gap-2 w-full sm:w-auto cursor-pointer"
                                            >
                                                <Camera className="w-4 h-4" />
                                                Scan Again
                                            </Button>
                                        </div>

                                        {/* Ingredients */}
                                        <div className="space-y-3">
                                            {scannedIngredients?.map((ingredient : any, index : number) => (
                                                <div
                                                    key={index}
                                                    className="
                                                flex items-start gap-3
                                                p-3 sm:p-4
                                                bg-stone-50
                                                rounded-xl
                                                border border-stone-200
                                            "
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-stone-900 break-words">
                                                            {ingredient.name}
                                                        </div>

                                                        <div className="text-sm text-stone-500 break-words">
                                                            {ingredient.quantity}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {ingredient.confidence && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs text-green-700 border-green-200"
                                                            >
                                                                {Math.round(
                                                                    ingredient.confidence * 100
                                                                )}
                                                                %
                                                            </Badge>
                                                        )}

                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                removeIngredient(index)
                                                            }
                                                            className="text-stone-600  hover:text-red-600 cursor-pointer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handleSaveScanned}
                                            disabled={
                                                saving ||
                                                scannedIngredients.length === 0
                                            }
                                            className="
                                        w-full
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white cursor-pointer
                                        h-11 sm:h-12
                                    "
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5 mr-2" />
                                                    Save {scannedIngredients.length} Items
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Manual Tab */}
                            <TabsContent value="manual" className="mt-4">
                                <form onSubmit={handleAddManual} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Ingredient Name
                                        </label>

                                        <input
                                            type="text"
                                            value={manualItem.name}
                                            onChange={(e) =>
                                                setManualItem({
                                                    ...manualItem,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., Chicken breast"
                                            className="
                                        w-full
                                        px-4 py-3
                                        border border-stone-200
                                        rounded-xl
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-orange-500
                                    "
                                            disabled={adding}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Quantity
                                        </label>

                                        <input
                                            type="text"
                                            value={manualItem.quantity}
                                            onChange={(e) =>
                                                setManualItem({
                                                    ...manualItem,
                                                    quantity: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., 500g, 2 cups"
                                            className="
                                        w-full
                                        px-4 py-3
                                        border border-stone-200
                                        rounded-xl
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-orange-500
                                    "
                                            disabled={adding}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={adding}
                                        className="
                                    w-full
                                    bg-orange-600
                                    hover:bg-orange-700
                                    text-white
                                    h-11 sm:h-12 cursor-pointer
                                "
                                    >
                                        {adding ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 mr-2" />
                                                Add Item
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}