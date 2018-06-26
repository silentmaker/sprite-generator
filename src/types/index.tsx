import { SpriteImage } from "../components/SpriteGenerator/SpriteGenerator";

export interface StoreState {
    alignStyle: string;
    originalImages: SpriteImage[];
    imagePadding: number;
}