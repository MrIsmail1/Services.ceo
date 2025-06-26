import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateServiceData } from "@/schemas/serviceSchema";
import { Zap } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function ServiceTestForm() {
  const { register, watch } = useFormContext<CreateServiceData>();
  const formData = watch();

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Test et validation</Label>
        <p className="text-sm text-gray-600">
          Testez votre service avant de le déployer
        </p>
      </div>

      <div>
        <Label htmlFor="testData">Données de test</Label>
        <Textarea
          id="testData"
          {...register("testData")}
          placeholder="Entrez des données de test pour valider votre service..."
          rows={3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Résumé du service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong>Nom:</strong> {formData.name || "Non défini"}
          </div>
          <div>
            <strong>Catégorie:</strong> {formData.category || "Non définie"}
          </div>
          <div>
            <strong>Agent:</strong> {formData.agent || "Non sélectionné"}
          </div>
          <div>
            <strong>Modèle:</strong> {formData.model || "Non défini"}
          </div>
          <div>
            <strong>Entrées:</strong> {formData.inputs?.length || 0}{" "}
            paramètre(s)
          </div>
          <div>
            <strong>Sorties:</strong> {formData.outputs?.length || 0}{" "}
            résultat(s)
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">
            Le service sera créé en mode test
          </span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          Vous pourrez le tester et l'activer une fois validé
        </p>
      </div>
    </div>
  );
}
