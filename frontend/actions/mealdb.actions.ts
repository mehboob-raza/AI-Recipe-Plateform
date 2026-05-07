'use server'


// const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"

'use server'

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export async function getMealsByCategory(category: string) {
    try {
        const res = await fetch(
            `${MEALDB_BASE_URL}/filter.php?c=${category}`,
            {
                next: { revalidate: 86400 }
            }
        )

        if (!res.ok) {
            throw new Error("Failed to fetch meals")
        }

        const data = await res.json()

        return {
            success: true,
            meals: data.meals || [],
            category
        }

    } catch (error: any) {
        console.error("Error fetching meals", error)

        throw new Error(error?.message || "Failed to load meals")
    }
}

export async function getMealsByArea(area: string) {
    try {
        const res = await fetch(
            `${MEALDB_BASE_URL}/filter.php?a=${area}`,
            {
                next: { revalidate: 86400 }
            }
        )

        if (!res.ok) {
            throw new Error("Failed to fetch meals")
        }

        const data = await res.json()

        return {
            success: true,
            meals: data.meals || [],
            area
        }

    } catch (error: any) {
        console.error("Error fetching meals", error)

        throw new Error(error?.message || "Failed to load meals")
    }
}

export async function getRecipeOfTheDay() {
    try {
        const res = await fetch(`${MEALDB_BASE_URL}/random.php`, {
            next: { revalidate: 86400 }
        })
        if (!res?.ok) {
            throw new Error("Failed to fetch recipe of the day")
        }
        const data = await res.json()
        return {
            success: true,
            recipe: data.meals
        }
    } catch (error: any) {
        console.error("Error fetching recipe of the day", error);
        throw new Error(error?.message || 'failed to load recipe')

    }
}

export async function getCategories() {
    try {
        const res = await fetch(`${MEALDB_BASE_URL}/list.php?c=list`, {
            next: { revalidate: 604800 }
        })
        if (!res?.ok) {
            throw new Error("Failed to fetch categories of the day")
        }
        const data = await res.json()
        return {
            success: true,
            categories: data.meals || []
        }
    } catch (error: any) {
        console.error("Error fetching categories of the day", error);
        throw new Error(error?.message || 'failed to load categories')
    }
}

export async function getAreas() {
    try {
        const res = await fetch(`${MEALDB_BASE_URL}/list.php?a=list`, {
            next: { revalidate: 604800 }
        })
        if (!res?.ok) {
            throw new Error("Failed to fetch areas of the day")
        }
        const data = await res.json()
        return {
            success: true,
            areas: data.meals || []
        }
    } catch (error: any) {
        console.error("Error fetching areas of the day", error);
        throw new Error(error?.message || 'failed to load areas')
    }
}

// export async function getMealsByCategory(category: string) {
//     try {
//         const res = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${category}`, {
//             next: { revalidate: 86400 }
//         })
//         if (!res?.ok) {
//             throw new Error("Failed to fetch Meals")
//         }
//         const data = await res.json()
//         return {
//             success: true,
//             meals: data.meals || [],
//             category
//         }
//     } catch (error: any) {
//         console.error("Error fetching meals", error);
//         throw new Error(error?.message || 'failed to load meals')
//     }
// }

// export async function getMealsByArea(area: string) {
//     try {
//         const res = await fetch(`${MEALDB_BASE_URL}/filter.php?c=${area}`, {
//             next: { revalidate: 86400 }
//         })
//         if (!res?.ok) {
//             throw new Error("Failed to fetch Meals")
//         }
//         const data = await res.json()
//         return {
//             success: true,
//             meals: data.meals || [],
//             area
//         }
//     } catch (error: any) {
//         console.error("Error fetching meals", error);
//         throw new Error(error?.message || 'failed to load meals')
//     }
// }
