import {
  Upload,
  Trash2,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProfilesService,
  OpenApiSpecService,
  type v1ExportOpenAPISpecResponse as ExportOpenAPISpecResponse,
  type v1HARFileWithFlags as HARFileWithFlags,
  type v1ApplicationProfile as ApplicationProfile,
  type v1GetProfileByIDResponse as GetProfileByIDResponse,
  type v1Application as Application,
} from "@/api/manager";
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components";
import { ApiGraphView } from "@/components/ApiGraphView";

interface ApplicationProfilesTabProps {
  application: Application
  profiles: Array<ApplicationProfile>;
}

export function ApplicationProfilesTab({ profiles, application }: ApplicationProfilesTabProps) {
  const { appId } = useParams({ strict: false }) as { appId: string };
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<File[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);
  const [expandedGraphs, setExpandedGraphs] = useState<Record<string, any>>({});

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const harFiles = await Promise.all(
        files.map(async (file) => ({
          content: await file.text(),
          is_sequence: flags[file.name] ?? false,
        }))
      ) as HARFileWithFlags[];

      await ProfilesService.managerServiceAddProfile(appId, {harFiles});
    },
    onSuccess: async () => {
      toast.success("Профиль загружен");
      setFlags({});
      await queryClient.invalidateQueries({ queryKey: ["application", appId] });
    },
    onError: () => toast.error("Ошибка при загрузке профиля"),
  });

  const exportMutation = useMutation({
    mutationFn: async (profile: ApplicationProfile) => {
      setLoadingProfileId(profile.id!);
      const res = await OpenApiSpecService.managerServiceExportOpenApiSpec({
        id: profile.id,
      }) as ExportOpenAPISpecResponse;

      const blob = new Blob([res.specJson!], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `openapi-profile-${application.name}-${profile.version}.json`;
      link.click();
    },
    onSettled: () => setLoadingProfileId(null),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await ProfilesService.managerServiceDeleteProfile(id);
    },
    onSuccess: async () => {
      toast.success("Профиль удалён");
      setDeletingId(null);
      await queryClient.invalidateQueries({ queryKey: ["profiles", appId] });
    },
    onError: () => {
      toast.error("Ошибка удаления");
      setDeletingId(null);
    },
  });

  const handleToggleExpand = async (profile: ApplicationProfile) => {
    const id = profile.id!;
    if (expandedProfileId === id) {
      setExpandedProfileId(null);
      return;
    }

    if (!expandedGraphs[id]) {
      const { profile: full } = await ProfilesService.managerServiceGetProfileById(id) as GetProfileByIDResponse;
      setExpandedGraphs((prev) => ({ ...prev, [id]: full?.apiGraph }));
    }

    setExpandedProfileId(id);
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Загрузка HAR-файлов */}
      <Card className="p-4 space-y-4">
        <Input
          type="file"
          accept=".har"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.map((file) => (
          <div
            key={file.name}
            className="flex justify-between items-center bg-muted rounded px-4 py-2 text-sm"
          >
            <span className="font-medium">{file.name}</span>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`checkbox-${file.name}`}
                checked={flags[file.name] || false}
                onCheckedChange={(val) => setFlags((prev) => ({ ...prev, [file.name]: val }))}
              />
              <label htmlFor={`checkbox-${file.name}`} className="text-sm">
                Является цепочкой
              </label>
            </div>
          </div>
        ))}

        <Button
          onClick={() => uploadMutation.mutate()}
          disabled={!files.length || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Загрузка...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Загрузить HAR
            </>
          )}
        </Button>
      </Card>

      {/* Список профилей */}
      {profiles?.length ? (
        <div className="space-y-4">
          {profiles.map((profile) => {
            const isExpanded = expandedProfileId === profile.id;
            return (
              <Card key={profile.id} className="p-4 space-y-4">
                <div
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => handleToggleExpand(profile)}
                >
                  <div>
                    <div className="font-medium text-lg">Версия: {profile.version}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(profile.createdAt!)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {profile.id}
                    </div>
                  </div>
                  <div className="flex self-center gap-2">
                    <LoadingButton
                      variant="outline"
                      onClick={() => exportMutation.mutate(profile)}
                      isLoading={loadingProfileId === profile.id}
                    >
                      <Download className="mr-2 h-4 w-4" /> Экспорт
                    </LoadingButton>
                    <LoadingButton
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(profile.id!);
                      }}
                      isLoading={deletingId === profile.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Удалить
                    </LoadingButton>
                    <Button variant="ghost" size="icon" className="ml-2">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {isExpanded && expandedGraphs[profile.id!] && (
                  <ApiGraphView graph={expandedGraphs[profile.id!]} />
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Нет профилей</p>
      )}
    </div>
  );
}
