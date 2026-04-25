import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function AuthSync() {
  const user = await currentUser();
 console.log(user);
  if (user) {
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (primaryEmail) {
      await db.user.upsert({
        where: { id: user.id },
        update: {
          email: primaryEmail,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          image: user.imageUrl,
        },
        create: {
          id: user.id, // Using the Clerk ID to ensure relation keys match
          email: primaryEmail,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          image: user.imageUrl,
        },
      });
    }
  }

  return null;
}
