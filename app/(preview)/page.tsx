"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { questionsSchema } from "@/lib/schemas";
import type { z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Quiz from "@/components/quiz";
import { Link } from "@/components/ui/link";
import NextLink from "next/link";
import { generateQuizTitle } from "./actions";
import { AnimatePresence, motion } from "framer-motion";
import type { LearningModule } from "@/components/learning-mode";
import { useRouter } from "next/navigation";

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const [mode, setMode] = useState<'quiz' | 'learn' | 'practice'>('quiz');
  const [quizMode, setQuizMode] = useState<'pdf' | 'subject'>('pdf');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});

  const subjects = [
    { 
      id: 'network', 
      name: 'Network Security', 
      description: 'Firewalls, protocols, and network defense',
      icon: '🌐'
    },
    { 
      id: 'crypto', 
      name: 'Cryptography', 
      description: 'Encryption, hashing, and secure communications',
      icon: '🔐'
    },
    { 
      id: 'web', 
      name: 'Web Security', 
      description: 'XSS, CSRF, and secure web development',
      icon: '🔒'
    },
    { 
      id: 'malware', 
      name: 'Malware Analysis', 
      description: 'Virus, trojans, and malware detection',
      icon: '🦠'
    },
    { 
      id: 'forensics', 
      name: 'Digital Forensics', 
      description: 'Evidence collection and analysis',
      icon: '🔍'
    },
    { 
      id: 'compliance', 
      name: 'Security Compliance', 
      description: 'Standards, regulations, and frameworks',
      icon: '📋'
    },
  ];

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 20 * 1024 * 1024,
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Please upload a PDF file under 20MB. This is required by our AI processing system.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (quizMode === 'pdf') {
      const encodedFiles = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await encodeFileAsBase64(file),
        })),
      );
      submit({ files: encodedFiles });
      const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
      setTitle(generatedTitle);
    } else {
      // Subject mode
      const subject = subjects.find(s => s.id === selectedSubject);
      submit({ subject: subject?.name });
      setTitle(`${subject?.name} Quiz`);
    }
  };

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
  };

  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;

  const handleModuleComplete = (moduleId: string, progress: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: progress
    }));
  };

  const router = useRouter();

  if (questions.length === 4) {
    return (
      <Quiz 
        title={title ?? "Quiz"} 
        questions={questions} 
        clearPDF={clearPDF}
        onSelectSubject={(subject) => {
          setQuizMode('subject');
          setSelectedSubject(subject);
          clearPDF();
        }} 
      />
    );
  }

  return (
    <div 
      className="min-h-[100dvh] w-full flex flex-col items-center pb-8"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-lg border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-6 px-4 sm:px-6">
          <motion.div 
            className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-full bg-primary/10 p-2">
              <FileUp className="h-5 w-5" />
            </div>
            <Plus className="h-4 w-4" />
            <div className="rounded-full bg-primary/10 p-2">
              <BookOpen className="h-5 w-5" />
            </div>
          </motion.div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome to Quizz AI</CardTitle>
            <CardDescription className="text-base">
              Master Information Security concepts through interactive learning and quizzes.
            </CardDescription>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                mode === 'quiz' ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onClick={() => setMode('quiz')}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <FileUp className="h-5 w-5" />
                <span className="font-medium">Upload PDF</span>
                <span className="text-xs text-muted-foreground">Test your knowledge</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="p-4 rounded-lg border-2 cursor-pointer transition-all border-muted-foreground/25"
              onClick={() => router.push('/learn')}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Learn</span>
                <span className="text-xs text-muted-foreground">Study materials</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                mode === 'practice' ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onClick={() => setMode('practice')}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Practice</span>
                <span className="text-xs text-muted-foreground">Test yourself</span>
              </div>
            </motion.div>
          </div>
        </CardHeader>
        <div className="px-4 sm:px-6 pb-6">
          {mode === 'quiz' && (
            <form onSubmit={handleSubmitWithFiles} className="space-y-4">
              {quizMode === 'pdf' ? (
                <motion.div
                  className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 transition-all hover:border-primary/50 hover:bg-primary/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FileUp className="h-8 w-8 mb-2 text-primary" />
                  </motion.div>
                  <motion.p 
                    className="text-sm text-muted-foreground text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {files.length > 0 ? (
                      <span className="font-medium text-primary flex items-center gap-2">
                        <span>📄</span> {files[0].name}
                      </span>
                    ) : (
                      <span className="flex flex-col items-center gap-1">
                        <span>Upload your InfoSec materials</span>
                        <span className="text-xs opacity-75">(PDF format, max 20MB)</span>
                      </span>
                    )}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid gap-2.5">
                    {subjects.map((subject) => (
                      <motion.div
                        key={subject.id}
                        className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                          selectedSubject === subject.id
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                        }`}
                        onClick={() => setSelectedSubject(subject.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" role="img" aria-label={subject.name}>{subject.icon}</span>
                          <div>
                            <h3 className="font-medium">{subject.name}</h3>
                            <p className="text-sm text-muted-foreground">{subject.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                  disabled={quizMode === 'pdf' ? files.length === 0 : !selectedSubject}
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Your Quiz...</span>
                    </span>
                  ) : (
                    "Create InfoSec Quiz"
                  )}
                </Button>
              </motion.div>
            </form>
          )}
          
          {mode === 'practice' && (
            <div className="text-center py-12 text-muted-foreground">
              Practice mode coming soon...
            </div>
          )}
        </div>

        {isLoading && (
          <CardFooter className="flex flex-col space-y-3 px-4 sm:px-6 pt-2 border-t">
            <div className="w-full">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>
                    {partialQuestions
                      ? `Question ${partialQuestions.length + 1} of 4`
                      : "Analyzing content"}
                  </span>
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
