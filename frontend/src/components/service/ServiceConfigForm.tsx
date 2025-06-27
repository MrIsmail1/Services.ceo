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
import { useEffect } from "react";

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

  // Gestion dynamique des règles de validation (clé/valeur)
  const validationRules = (Array.isArray(watch("validationRules")) ? watch("validationRules") : []) || [];
  const setValidationRules = (rules: any) => setValue("validationRules", rules);
  // Gestion dynamique de la config UI (clé/valeur)
  const uiConfig = (Array.isArray(watch("uiConfig")) ? watch("uiConfig") : []) || [];
  const setUiConfig = (config: any) => setValue("uiConfig", config);

  // Handler pour la température
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(",", ".");
    if (value === "") setValue("temperature", undefined);
    else setValue("temperature", parseFloat(value));
  };

  // Synchronise prompt avec systemPrompt + userPrompt pour la validation
  useEffect(() => {
    const sys = watch("systemPrompt") || "";
    const user = watch("userPrompt") || "";
    setValue("prompt", `${sys}\n${user}`);
    // eslint-disable-next-line
  }, [watch("systemPrompt"), watch("userPrompt")]);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">
          Configuration des entrées et sorties
        </Label>
        <p className="text-sm text-gray-600">
          Définissez les paramètres d'entrée et de sortie de votre service
        </p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setValue("systemPrompt", `Tu es un assistant IA spécialisé dans le recrutement et la recherche de profils.

RÈGLES IMPORTANTES :
1. Tu dois toujours être utile et fournir des réponses précises
2. Si tu estimes ne pas avoir assez de contexte pour répondre, tu DOIS poser des questions pour clarifier
3. Sois interactif et guide l'utilisateur vers une réponse complète
4. Explique clairement ce que tu peux faire et ce dont tu as besoin
5. Ne donne jamais de réponses vagues ou génériques

CAPACITÉS :
- Analyse de CV et profils
- Évaluation des compétences
- Recommandations de recrutement
- Questions ciblées pour clarifier les besoins`);
            setValue("userPrompt", `Analyse les informations fournies et fournis une évaluation détaillée.

Si les informations fournies ne sont pas suffisantes pour répondre de manière précise, pose des questions pour clarifier :
- Quel type de poste est recherché ?
- Quelles sont les compétences prioritaires ?
- Y a-t-il des contraintes de localisation ou de salaire ?
- Quel niveau d'expérience est requis ?

Données à analyser : {input}

FORMAT DE RÉPONSE :
- Évaluation générale du profil
- Points forts identifiés
- Points d'amélioration
- Recommandations spécifiques
- Questions supplémentaires si nécessaire`);
          }}
          className="mt-2"
        >
          Charger exemple interactif
        </Button>
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
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={watch(`inputs.${index}.required`) ?? false}
                onChange={e => setValue(`inputs.${index}.required`, e.target.checked)}
                className="mr-2"
              />
              <span className="text-xs">Requis</span>
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
        <Label htmlFor="systemPrompt">Prompt système (preset)</Label>
        <p className="text-sm text-gray-600 mb-2">
          Définit le rôle et le contexte de l'agent IA. Incluez des règles pour qu'il soit interactif et pose des questions si nécessaire.
        </p>
        <Textarea
          id="systemPrompt"
          {...register("systemPrompt" as any)}
          placeholder={`Ex: Tu es un assistant expert en recrutement spécialisé dans la recherche de profils techniques.

RÈGLES IMPORTANTES :
1. Tu dois toujours être utile et fournir des réponses précises
2. Si tu estimes ne pas avoir assez de contexte pour répondre, tu DOIS poser des questions pour clarifier
3. Sois interactif et guide l'utilisateur vers une réponse complète
4. Explique clairement ce que tu peux faire et ce dont tu as besoin
5. Ne donne jamais de réponses vagues ou génériques`}
          rows={6}
        />
        {errors["systemPrompt"] && (
          <p className="text-sm text-red-600 mt-1">{errors["systemPrompt"].message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="userPrompt">Prompt utilisateur (template)</Label>
        <p className="text-sm text-gray-600 mb-2">
          Template pour traiter les entrées utilisateur. Utilisez {`{input}`}, {`{texte}`}, {`{question}`} ou {`{context}`} pour les données. Incluez des instructions pour poser des questions si nécessaire.
        </p>
        <Textarea
          id="userPrompt"
          {...register("userPrompt" as any)}
          placeholder={`Ex: Analyse ce CV et fournis une évaluation détaillée.

Si les informations fournies ne sont pas suffisantes pour répondre de manière précise, pose des questions pour clarifier :
- Quel type de poste est recherché ?
- Quelles sont les compétences prioritaires ?
- Y a-t-il des contraintes de localisation ou de salaire ?

Données à analyser : {input}`}
          rows={4}
        />
        {errors["userPrompt"] && (
          <p className="text-sm text-red-600 mt-1">{errors["userPrompt"].message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="temperature">Température (créativité IA)</Label>
        <Input
          id="temperature"
          type="number"
          step="0.01"
          min={0}
          max={2}
          value={watch("temperature") ?? ""}
          onChange={handleTemperatureChange}
          placeholder="0.7"
        />
        {errors["temperature"] && (
          <p className="text-sm text-red-600 mt-1">{errors["temperature"].message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="structuredOutput"
          type="checkbox"
          checked={!!watch("structuredOutput")}
          onChange={e => setValue("structuredOutput", e.target.checked)}
        />
        <Label htmlFor="structuredOutput">Sortie structurée (JSON)</Label>
      </div>

      <div>
        <Label>Règles de validation</Label>
        <Button type="button" size="sm" onClick={() => setValidationRules([...validationRules, { key: "", value: "" }])}>Ajouter une règle</Button>
        {validationRules.map((rule: any, idx: number) => (
          <div key={idx} className="flex gap-2 my-1">
            <Input
              placeholder="Clé"
              value={rule.key}
              onChange={e => {
                const newRules = [...validationRules];
                newRules[idx].key = e.target.value;
                setValidationRules(newRules);
              }}
            />
            <Input
              placeholder="Valeur"
              value={rule.value}
              onChange={e => {
                const newRules = [...validationRules];
                newRules[idx].value = e.target.value;
                setValidationRules(newRules);
              }}
            />
            <Button type="button" size="sm" variant="destructive" onClick={() => setValidationRules(validationRules.filter((_: any, i: number) => i !== idx))}>Supprimer</Button>
          </div>
        ))}
      </div>

      <div>
        <Label>UI Config</Label>
        <Button type="button" size="sm" onClick={() => setUiConfig([...uiConfig, { key: "", value: "" }])}>Ajouter une config</Button>
        {uiConfig.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-2 my-1">
            <Input
              placeholder="Clé"
              value={item.key}
              onChange={e => {
                const newConfig = [...uiConfig];
                newConfig[idx].key = e.target.value;
                setUiConfig(newConfig);
              }}
            />
            <Input
              placeholder="Valeur"
              value={item.value}
              onChange={e => {
                const newConfig = [...uiConfig];
                newConfig[idx].value = e.target.value;
                setUiConfig(newConfig);
              }}
            />
            <Button type="button" size="sm" variant="destructive" onClick={() => setUiConfig(uiConfig.filter((_: any, i: number) => i !== idx))}>Supprimer</Button>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="prompt">Prompt pour l'agent (déprécié, utilisez les champs ci-dessus)</Label>
        <Textarea
          id="prompt"
          {...register("prompt")}
          placeholder="Décrivez la tâche que l'agent doit accomplir..."
          rows={2}
        />
        {errors.prompt && (
          <p className="text-sm text-red-600 mt-1">{errors.prompt.message}</p>
        )}
      </div>
    </div>
  );
}
