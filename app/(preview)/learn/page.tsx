"use client";

import { useRouter } from "next/navigation";
import { learningModules } from "@/lib/learning-content";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ChevronRight, Timer } from "lucide-react";

function ModuleCard({ 
  module, 
  onClick, 
  progress = 0 
}: { 
  module: typeof learningModules[number];
  onClick: () => void;
  progress?: number;
}) {
  const difficultyColors = {
    Beginner: 'text-emerald-500 border-emerald-200',
    Intermediate: 'text-amber-500 border-amber-200',
    Advanced: 'text-rose-500 border-rose-200'
  };

  const difficultyColor = difficultyColors[module.difficulty];

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="relative overflow-hidden transition-all hover:shadow-lg">
        {progress > 0 && (
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{module.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className={`px-2.5 py-0.5 rounded-full border ${difficultyColor}`}>
              {module.difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Timer className="h-4 w-4" />
              {module.estimatedTime}
            </span>
            {progress === 100 && (
              <span className="ml-auto text-emerald-500 text-sm font-medium">
                Completed
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function LearnPage() {
  const router = useRouter();
  const progress: Record<string, number> = {}; // This would come from your backend/storage

  const completedModules = Object.values(progress).filter(p => p === 100).length;

  return (
    <div className="min-h-[100dvh] py-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Learning Modules</h2>
              <p className="text-muted-foreground">
                Master Information Security concepts through interactive lessons
              </p>
            </div>
            {completedModules > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Progress value={(completedModules / learningModules.length) * 100} className="w-20 h-2" />
                <span>{completedModules} of {learningModules.length}</span>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {learningModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={() => router.push(`/learn/${module.id}`)}
                progress={progress[module.id]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 