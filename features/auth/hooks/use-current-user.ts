import { useUser } from "@clerk/nextjs";

export const useCurrentUser = () => {
    const { user } = useUser();

    return user;
};