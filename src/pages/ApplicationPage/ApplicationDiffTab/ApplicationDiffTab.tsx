import { useMutation } from "@tanstack/react-query";
import {
  ProfilesService,
  type v1DiffProfilesResponse as DiffProfilesResponse,
  type v1ApplicationProfile as ApplicationProfile,
} from "@/api/manager";
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { PlusCircle, MinusCircle } from "lucide-react";

interface ApplicationDiffTabProps {
  profiles: Array<ApplicationProfile>;
}

const methodColorMap: Record<string, string> = {
  GET: "bg-blue-500",
  POST: "bg-green-500",
  PUT: "bg-yellow-500",
  DELETE: "bg-red-500",
  PATCH: "bg-purple-500",
};

export const ApplicationDiffTab = ({ profiles }: ApplicationDiffTabProps) => {
  const { appId } = useParams({ strict: false }) as { appId: string };

  const [oldId, setOldId] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);
  const [diff, setDiff] = useState<DiffProfilesResponse | null>(null);

  const diffMutation = useMutation({
    mutationFn: async () => {
      if (!oldId || !newId) return;
      const res = await ProfilesService.managerServiceDiffProfiles(
        appId,
        oldId,
        newId
      );
      return res as DiffProfilesResponse;
    },
    onSuccess: (data) => {
      setDiff(data!);
    },
    onError: () => toast.error("Ошибка при сравнении профилей"),
  });

  const renderOperation = (op: any) => {
    const methodClass = methodColorMap[op.method] || "bg-gray-500";
    return (
      <li
        key={op.id}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition"
      >
        <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded ${methodClass}`}>
          {op.method}
        </span>
        <span className="text-sm font-mono">{op.pathSegmentId}</span>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="w-full">
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Старая версия
          </label>
          <Select onValueChange={setOldId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите старую версию" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id!}>
                  Версия {p.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Новая версия
          </label>
          <Select onValueChange={setNewId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите новую версию" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id!}>
                  Версия {p.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="whitespace-nowrap"
          onClick={() => diffMutation.mutate()}
          disabled={!oldId || !newId}
        >
          Сравнить
        </Button>
      </div>

      {diff && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="flex items-center gap-2 text-green-600 font-semibold text-base mb-3">
              <PlusCircle size={18} /> Добавлены
            </h3>
            <ul>
              {diff.added?.length ? (
                diff.added.map(renderOperation)
              ) : (
                <li className="text-muted-foreground">Нет изменений</li>
              )}
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="flex items-center gap-2 text-red-600 font-semibold text-base mb-3">
              <MinusCircle size={18} /> Удалены
            </h3>
            <ul>
              {diff.removed?.length ? (
                diff.removed.map(renderOperation)
              ) : (
                <li className="text-muted-foreground">Нет изменений</li>
              )}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};
