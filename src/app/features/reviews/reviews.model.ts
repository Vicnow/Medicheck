export type Review = {
        id?: number;
        hospitalId: string;
        userId: string;
        rating: number; // 1..5
        text: string;
        createdAt: number;
        updatedAt: number;
};
