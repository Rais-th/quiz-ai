import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { 
  ChevronLeft,
  BookOpen, 
  CheckCircle, 
  LightbulbIcon,
  AlertCircle,
  Trophy,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import type { LearningModule } from "@/components/learning-mode";

interface ModuleContentProps {
  module: LearningModule;
  onBack: () => void;
  onComplete: (moduleId: string, progress: number) => void;
}

const ContentSection = motion(Card);

export default function ModuleContent({ module, onBack, onComplete }: ModuleContentProps) {
  const [currentSection, setCurrentSection] = useState<'intro' | 'content' | 'practice'>('intro');
  const [progress, setProgress] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    onComplete(module.id, newProgress);
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const checkAnswers = () => {
    const correct = module.content.practiceQuestions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    setCorrectAnswers(correct);
    setShowResults(true);
    
    const score = (correct / module.content.practiceQuestions.length) * 100;
    if (score >= 70) {
      updateProgress(100);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Modules
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{module.icon}</span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
                <p className="text-muted-foreground">{module.description}</p>
              </div>
            </div>
          </div>

          <nav className="flex gap-2">
            {(['intro', 'content', 'practice'] as const).map((section) => (
              <div
                key={section}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  currentSection === section ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </nav>

          <div className="grid gap-6">
            {currentSection === 'intro' && (
              <ContentSection
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {module.content.introduction}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Key Points</h3>
                    <ul className="grid gap-3">
                      {module.content.keyPoints.map((point, index) => (
                        <motion.li
                          key={`key-point-${point.substring(0, 20)}`}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setCurrentSection('content');
                      updateProgress(33);
                    }}
                  >
                    Continue to Examples
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </ContentSection>
            )}

            {currentSection === 'content' && (
              <ContentSection
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Real-World Examples</h2>
                    <p className="text-muted-foreground">
                      Learn through practical scenarios and solutions.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {module.content.examples.map((example, index) => (
                      <motion.div
                        key={`example-${example.scenario.substring(0, 20)}`}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <Card className="p-4 bg-muted/50">
                          <h3 className="font-medium mb-2">Scenario {index + 1}</h3>
                          <p className="text-muted-foreground">{example.scenario}</p>
                        </Card>
                        <Card className="p-4 border-primary/20">
                          <h3 className="font-medium mb-2">Solution</h3>
                          <p className="whitespace-pre-line text-muted-foreground">{example.explanation}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setCurrentSection('practice');
                      updateProgress(66);
                    }}
                  >
                    Start Practice Questions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </ContentSection>
            )}

            {currentSection === 'practice' && (
              <ContentSection
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Practice Questions</h2>
                    <p className="text-muted-foreground">
                      Test your knowledge with these questions.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {module.content.practiceQuestions.map((question, qIndex) => (
                      <motion.div
                        key={`question-${question.question.substring(0, 20)}`}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: qIndex * 0.2 }}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="font-medium text-lg">Q{qIndex + 1}.</span>
                            <div className="space-y-4 flex-1">
                              <p className="font-medium text-lg">{question.question}</p>
                              <div className="grid gap-2">
                                {question.options.map((option) => (
                                  <motion.button
                                    key={`option-${option}`}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                                      selectedAnswers[qIndex] === option
                                        ? showResults
                                          ? option === question.answer
                                            ? 'border-emerald-500 bg-emerald-500/10'
                                            : 'border-rose-500 bg-rose-500/10'
                                          : 'border-primary bg-primary/10'
                                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                                    }`}
                                    onClick={() => handleAnswerSelect(qIndex, option)}
                                    whileHover={!showResults ? { scale: 1.01 } : {}}
                                    whileTap={!showResults ? { scale: 0.99 } : {}}
                                  >
                                    {option}
                                    {showResults && selectedAnswers[qIndex] === option && (
                                      <span className="ml-2">
                                        {option === question.answer ? '✓' : '✗'}
                                      </span>
                                    )}
                                  </motion.button>
                                ))}
                              </div>
                              {showResults && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`p-4 rounded-lg ${
                                    selectedAnswers[qIndex] === question.answer
                                      ? 'bg-emerald-500/10'
                                      : 'bg-rose-500/10'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {selectedAnswers[qIndex] === question.answer ? (
                                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-1" />
                                    )}
                                    <div>
                                      <p className="font-medium">
                                        {selectedAnswers[qIndex] === question.answer
                                          ? 'Correct!'
                                          : 'Incorrect'}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {question.explanation}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {!showResults ? (
                    <Button
                      className="w-full"
                      onClick={checkAnswers}
                      disabled={Object.keys(selectedAnswers).length !== module.content.practiceQuestions.length}
                    >
                      Check Answers
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <Card className="p-6">
                        <div className="text-center space-y-4">
                          <Trophy className={`h-12 w-12 mx-auto ${
                            correctAnswers === module.content.practiceQuestions.length
                              ? 'text-yellow-500'
                              : correctAnswers >= module.content.practiceQuestions.length * 0.7
                              ? 'text-emerald-500'
                              : 'text-rose-500'
                          }`} />
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              {correctAnswers === module.content.practiceQuestions.length
                                ? 'Perfect Score!'
                                : correctAnswers >= module.content.practiceQuestions.length * 0.7
                                ? 'Well Done!'
                                : 'Keep Learning!'}
                            </h3>
                            <p className="text-muted-foreground">
                              You got {correctAnswers} out of {module.content.practiceQuestions.length} questions correct.
                            </p>
                          </div>
                        </div>
                      </Card>
                      
                      <Button
                        className="w-full"
                        onClick={onBack}
                        variant={correctAnswers >= module.content.practiceQuestions.length * 0.7 ? 'default' : 'outline'}
                      >
                        {correctAnswers >= module.content.practiceQuestions.length * 0.7
                          ? 'Complete Module'
                          : 'Review Module'}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </ContentSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 