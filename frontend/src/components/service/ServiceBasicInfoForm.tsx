"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateServiceData } from "@/schemas/serviceSchema";
import { useFormContext } from "react-hook-form";

const serviceCategories = [
    "Traitement de texte",
    "Analyse",
    "Traduction",
    "Génération de contenu",
    "Classification",
    "Extraction de données",
    "Autre",
];

export function ServiceBasicInfoForm() {
    const { register, formState: { errors }, setValue, watch } = useFormContext<CreateServiceData>();
    const category = watch("category");

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name">Nom du service</Label>
                <Input id="name" {...register("name")} placeholder="Ex: Générateur de résumés" />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} placeholder="Décrivez ce que fait votre service..." rows={3} />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>

            <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        {serviceCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
            </div>

            {/*
            <div>
                <Label htmlFor="authorId">ID de l'auteur</Label>
                <Input id="authorId" {...register("authorId")} placeholder="UUID de l'auteur" />
                {errors["authorId"] && <p className="text-sm text-red-600 mt-1">{errors["authorId"].message}</p>}
            </div>
            */}

            <div>
                <Label htmlFor="price">Prix</Label>
                <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="Prix du service" />
                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
            </div>

            <div>
                <Label htmlFor="isPublic">Visibilité</Label>
                <Select value={watch("isPublic") ? "public" : "private"} onValueChange={value => setValue("isPublic", value === "public") }>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisissez la visibilité" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
