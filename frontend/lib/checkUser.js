import { currentUser } from '@clerk/nextjs/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL 
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN
export const checkUser = async () => {

    const user = await currentUser()

    if (!user) {
        console.log('No User Found');
        return null
    }

    if (!STRAPI_API_TOKEN) {
        console.error('STRAPI_API_TOKEN is missing in .env');
        return null
    }

    const subscriptionTier = 'free'

    //check if user exist in strapi or not
    try {
        const query = new URLSearchParams({ 'filters[clerkId][$eq]': user.id }).toString()
        const existingUserResponse = await fetch(`${STRAPI_URL}/api/users?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`
            },
            cache: 'no-store'
        })
        console.log('existingUserResponse', existingUserResponse);

        if (!existingUserResponse.ok) {
            const errorText = await existingUserResponse.text()
            console.error('Strapi response error', errorText);
            return null
        }

        const existingUserData = await existingUserResponse.json()

        const existingUsers = existingUserData
        if (existingUsers.length > 0) {
            const existingUser = existingUsers[0]

            if (existingUser.subscriptionTier !== subscriptionTier) {
                await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                    },
                    body: JSON.stringify({ subscriptionTier })
                })
            }
            return { ...existingUser, subscriptionTier }
        }

        // create new user in strapi
        const rolesResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            }
        })
        const rolesData = await rolesResponse.json()
        const authenticateRole = rolesData.roles.find((role) => role.type === 'authenticated')

        if (!authenticateRole) {
            console.error('Authenticate Role Not found');
            return null
        }

        const userData = {
            username: user.username || user.emailAddresses[0].emailAddress.split('@')[0],
            email: user.emailAddresses[0].emailAddress,
            password: `clerk_managed_${user.id}_${Date.now()}`,
            clerkId: user.id,
            subscriptionTier,
            confirmed: true,
            blocked: false,
            role: authenticateRole.id,
            firstname: user.firstName,
            lastname: user.lastName,
            imageUrd: user.imageUrl,

        }

        const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify(userData)
        })
        if (!newUserResponse.ok) {
            const errorText = await newUserResponse.text()
            console.error('Strapi Error response', errorText);
            return null

        }
        const newUser = await newUserResponse.json()
        return newUser
    } catch (error) {
        console.error('Error in check Users', error)
        return null
    }


}