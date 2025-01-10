"use client";

import { useRouter } from "next/navigation";
import ModuleContent from "@/components/module-content";
import { learningModules } from "@/lib/learning-content";
import { useState, use } from "react";
import { toast } from "sonner";

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const router = useRouter();
  const { moduleId } = use(params);
  const learningModule = learningModules.find((m) => m.id === moduleId);
  const [progress, setProgress] = useState<Record<string, number>>({});

  if (!learningModule) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Module Not Found</h1>
          <p className="text-muted-foreground">The module you&apos;re looking for doesn&apos;t exist.</p>
          <button 
            type="button"
            onClick={() => router.push("/learn")}
            className="text-primary hover:underline"
          >
            Return to Learning Modules
          </button>
        </div>
      </div>
    );
  }

  const handleComplete = (moduleId: string, progress: number) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: progress
    }));
  };

  return (
    <div className="min-h-[100dvh] py-8">
      <ModuleContent
        module={learningModule}
        onBack={() => router.push("/learn")}
        onComplete={handleComplete}
      />
    </div>
  );
} 