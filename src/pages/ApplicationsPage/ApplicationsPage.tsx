import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApplicationsService,
  type v1ListApplicationsResponse as ListApplicationsResponse,
} from "@/api/manager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { LoadingButton } from "@/components";
import { Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ApplicationsPage = () => {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: applications, isLoading: isApplicationLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res =
        (await ApplicationsService.managerServiceListApplications()) as ListApplicationsResponse;
      return res.applications;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      return ApplicationsService.managerServiceCreateApplication({ name });
    },
    onSuccess: async () => {
      toast.success("Приложение создано");
      setNewName("");
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: () => toast.error("Ошибка создания"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      return ApplicationsService.managerServiceDeleteApplication(id);
    },
    onSuccess: async () => {
      toast.success("Удалено");
      setDeletingId(null);
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: () => {
      toast.error("Ошибка удаления");
      setDeletingId(null);
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок + Создание */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Приложения</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Создать
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Новое приложение</DialogTitle>
            <Input
              placeholder="Название"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <LoadingButton
              className="mt-4"
              isLoading={createMutation.isPending}
              onClick={() => createMutation.mutate(newName)}
              disabled={!newName.trim()}
            >
              Создать
            </LoadingButton>
          </DialogContent>
        </Dialog>
      </div>

      {/* Список приложений */}
      {isApplicationLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {applications?.map((app) => (
            <div
              key={app.id}
              className="border rounded-xl p-4 flex justify-between items-start hover:shadow transition"
            >
              <div>
                <div className="text-lg font-medium">{app.name}</div>
                <div className="text-sm text-muted-foreground">{app.id}</div>
              </div>
              <div className="flex self-center gap-2">
                <Link
                  to="/applications/$appId"
                  params={{ appId: app.id } as { appId: string }}
                >
                  <Button variant="outline">Открыть</Button>
                </Link>
                <LoadingButton
                  variant="destructive"
                  isLoading={deletingId === app.id}
                  onClick={() => deleteMutation.mutate(app.id!)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Удалить
                </LoadingButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
