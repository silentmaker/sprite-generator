import { SpriteImage } from "../components/SpriteGenerator/SpriteGenerator";

export interface StoreState {
    imageSize: number;
    alignStyle: string;
    originalImages: SpriteImage[];
    imagePadding: number;
}