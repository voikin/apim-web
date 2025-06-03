import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  ApplicationsService,
  type v1GetApplicationResponse as GetApplicationResponse
} from "@/api/manager";
import { useParams, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationProfilesTab } from "./ApplicationProfilesTab/ApplicationsProfilesTab";
import { ApplicationDiffTab } from "./ApplicationDiffTab/ApplicationDiffTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const ApplicationPage = () => {
  const { appId } = useParams({ strict: false }) as { appId: string };

  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["application", appId],
    queryFn: async () => {
      const res = (await ApplicationsService.managerServiceGetApplication(
        appId
      )) as GetApplicationResponse;
      return res;
    },
  });

  if (error) {
    toast.error("Ошибка загрузки приложения");
    return <div className="p-6">Ошибка загрузки приложения</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Назад */}
      <div>
        <Link to="/">
          <Button variant="ghost" className="px-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>
      </div>

      {/* Заголовок */}
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">{application?.application?.name}</h1>
          <p className="text-muted-foreground text-sm">{application?.application?.id}</p>
        </div>
      )}

      {/* Вкладки */}
      <Tabs defaultValue="profiles" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="profiles">Профили</TabsTrigger>
          <TabsTrigger value="diff">Diff</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          {isLoading ? (
            <div className="space-y-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ApplicationProfilesTab profiles={application?.profiles!} application={application?.application!} />
          )}
        </TabsContent>

        <TabsContent value="diff">
          {isLoading ? (
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-9 w-1/2" />
              <Skeleton className="h-9 w-1/2" />
              <Skeleton className="h-9 w-[120px]" />
            </div>
          ) : (
            <ApplicationDiffTab profiles={application?.profiles!} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
