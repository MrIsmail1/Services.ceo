"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateServiceData } from "@/schemas/serviceSchema";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function ServiceConfigForm() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateServiceData>();

  const {
    fields: inputFields,
    append: appendInput,
    remove: removeInput,
  } = useFieldArray({
    control,
    name: "inputs",
  });

  const {
    fields: outputFields,
    append: appendOutput,
    remove: removeOutput,
  } = useFieldArray({
    control,
    name: "outputs",
  });

  const addInput = () => {
    appendInput({ name: "", type: "text", description: "", required: false });
  };

  const addOutput = () => {
    appendOutput({ name: "", type: "text", description: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">
          Configuration des entrées et sorties
        </Label>
        <p className="text-sm text-gray-600">
          Définissez les paramètres d'entrée et de sortie de votre service
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="font-medium">Entrées</Label>
          <Button type="button" variant="outline" size="sm" onClick={addInput}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {inputFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-2 mb-2 items-end"
          >
            <div className="col-span-4">
              <Input
                placeholder="Nom du paramètre"
                {...register(`inputs.${index}.name`)}
              />
            </div>
            <div className="col-span-3">
              <Select
                value={watch(`inputs.${index}.type`)}
                onValueChange={(value) =>
                  setValue(`inputs.${index}.type`, value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="number">Nombre</SelectItem>
                  <SelectItem value="boolean">Booléen</SelectItem>
                  <SelectItem value="file">Fichier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Input
                placeholder="Description (optionnel)"
                {...register(`inputs.${index}.description`)}
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeInput(index)}
                disabled={inputFields.length === 1}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {errors.inputs && (
          <p className="text-sm text-red-600">{errors.inputs.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="font-medium">Sorties</Label>
          <Button type="button" variant="outline" size="sm" onClick={addOutput}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {outputFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-2 mb-2 items-end"
          >
            <div className="col-span-4">
              <Input
                placeholder="Nom de la sortie"
                {...register(`outputs.${index}.name`)}
              />
            </div>
            <div className="col-span-3">
              <Select
                value={watch(`outputs.${index}.type`)}
                onValueChange={(value) =>
                  setValue(`outputs.${index}.type`, value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="file">Fichier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Input
                placeholder="Description (optionnel)"
                {...register(`outputs.${index}.description`)}
              />
            </div>
            <div className="col-span-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeOutput(index)}
                disabled={outputFields.length === 1}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {errors.outputs && (
          <p className="text-sm text-red-600">{errors.outputs.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="prompt">Prompt pour l'agent</Label>
        <Textarea
          id="prompt"
          {...register("prompt")}
          placeholder="Décrivez la tâche que l'agent doit accomplir..."
          rows={4}
        />
        {errors.prompt && (
          <p className="text-sm text-red-600 mt-1">{errors.prompt.message}</p>
        )}
      </div>
    </div>
  );
}
