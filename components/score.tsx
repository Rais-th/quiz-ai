import { motion, useMotionValue, useTransform, animate, useAnimationControls } from "framer-motion";
import { Button } from "./ui/button";
import confetti from 'canvas-confetti';
import { ArrowRight, Share2, Trophy, Star, Sparkles, BookOpen } from "lucide-react";
import { useEffect } from 'react';

interface ScoreProps {
  score: number;
  total: number;
  onReset: () => void;
  onSelectSubject?: (subject: string) => void;
}

const suggestedSubjects = [
  {
    id: 'network',
    title: "Network Security",
    description: "Learn about firewalls, IDS/IPS, and network protocols",
    icon: "🌐",
    difficulty: "Intermediate",
    estimatedTime: "2-3 hours"
  },
  {
    id: 'web',
    title: "Web Security",
    description: "Explore XSS, CSRF, and secure coding practices",
    icon: "🔒",
    difficulty: "Advanced",
    estimatedTime: "3-4 hours"
  },
  {
    id: 'crypto',
    title: "Cryptography",
    description: "Study encryption, hashing, and digital signatures",
    icon: "🔐",
    difficulty: "Expert",
    estimatedTime: "4-5 hours"
  }
];

export default function Score({ score, total, onReset, onSelectSubject }: ScoreProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const controls = useAnimationControls();
  const percentage = (score / total) * 100;

  useEffect(() => {
    const animation = animate(count, percentage, {
      duration: 2,
      ease: "easeOut",
      onComplete: () => {
        triggerCelebration();
      }
    });

    return animation.stop;
  }, [count, percentage]);

  const getMotivationalMessage = () => {
    if (percentage === 100) return { message: "Perfect Score! You're a Security Pro!", icon: Trophy, color: "text-green-500" };
    if (percentage >= 80) return { message: "Excellent Work! Keep it up!", icon: Star, color: "text-yellow-500" };
    if (percentage >= 60) return { message: "Good Progress! Room to grow!", icon: Sparkles, color: "text-blue-500" };
    return { message: "Keep Learning! You've got this!", icon: BookOpen, color: "text-primary" };
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My InfoSec Quiz Result',
        text: `I scored ${percentage}% on my Information Security quiz! 🔒`,
        url: window.location.href
      });
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage === 100) return "text-green-500";
    if (percentage >= 80) return "text-emerald-500";
    if (percentage >= 60) return "text-yellow-500";
    if (percentage >= 40) return "text-orange-500";
    if (percentage >= 20) return "text-red-400";
    return "text-red-500";
  };

  const getScoreGlow = (percentage: number) => {
    if (percentage === 100) return "bg-green-500/20";
    if (percentage >= 80) return "bg-emerald-500/20";
    if (percentage >= 60) return "bg-yellow-500/20";
    if (percentage >= 40) return "bg-orange-500/20";
    if (percentage >= 20) return "bg-red-400/20";
    return "bg-red-500/20";
  };

  const Message = getMotivationalMessage();
  const scoreColor = getScoreColor(percentage);
  const scoreGlow = getScoreGlow(percentage);

  const handleSubjectSelect = (subject: typeof suggestedSubjects[number]) => {
    if (onSelectSubject) {
      onSelectSubject(subject.id);
    }
    onReset();
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto space-y-8 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center space-y-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold">Quiz Complete!</h1>
        
        <motion.div 
          className="relative inline-flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            duration: 0.8,
            delay: 0.3
          }}
        >
          <motion.div 
            className={`absolute inset-0 rounded-full blur-2xl`}
            style={{
              background: useTransform(
                count,
                [0, 20, 40, 60, 80, 100],
                [
                  "rgba(239, 68, 68, 0.2)",  // red-500/20
                  "rgba(251, 113, 133, 0.2)", // red-400/20
                  "rgba(249, 115, 22, 0.2)",  // orange-500/20
                  "rgba(234, 179, 8, 0.2)",   // yellow-500/20
                  "rgba(16, 185, 129, 0.2)",  // emerald-500/20
                  "rgba(34, 197, 94, 0.2)",   // green-500/20
                ]
              )
            }}
          />
          <motion.div 
            className="text-8xl font-bold"
            style={{
              color: useTransform(
                count,
                [0, 20, 40, 60, 80, 100],
                [
                  "rgb(239, 68, 68)",  // red-500
                  "rgb(251, 113, 133)", // red-400
                  "rgb(249, 115, 22)",  // orange-500
                  "rgb(234, 179, 8)",   // yellow-500
                  "rgb(16, 185, 129)",  // emerald-500
                  "rgb(34, 197, 94)",   // green-500
                ]
              )
            }}
          >
            <motion.span>{rounded}</motion.span>%
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-center gap-2 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.3 }}
        >
          <Message.icon className={`h-6 w-6 ${scoreColor}`} />
          <p className="font-medium">{Message.message}</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mx-auto flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          Share Your Score
        </motion.button>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-semibold">Recommended Learning Path</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {suggestedSubjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl border-2 border-primary/20 hover:border-primary/50 bg-card hover:bg-card/80 transition-all cursor-pointer shadow-lg hover:shadow-xl"
              onClick={() => handleSubjectSelect(subject)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{subject.icon}</span>
                    <h3 className="font-semibold text-lg">{subject.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{subject.description}</p>
                  <div className="flex gap-2 text-xs">
                    <span className={`px-3 py-1 rounded-full ${
                      subject.difficulty === 'Expert' ? 'bg-red-500/10 text-red-500' :
                      subject.difficulty === 'Advanced' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {subject.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {subject.estimatedTime}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button 
          onClick={onReset}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg py-6 shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          Try Another Quiz
        </Button>
      </motion.div>
    </motion.div>
  );
}
