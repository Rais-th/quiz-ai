import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export interface ScoreProps {
  score: number;
  total: number;
  onReset?: () => void;
}

export default function Score({ score, total, onReset }: ScoreProps) {
  const percentage = (score / total) * 100;

  useEffect(() => {
    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  return (
    <motion.div 
      className="text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Score</h2>
        <p className="text-4xl font-bold text-primary">{score} / {total}</p>
        <p className="text-muted-foreground">
          {percentage >= 80 && "🎉 Excellent! You've mastered this topic!"}
          {percentage >= 60 && percentage < 80 && "👍 Good job! Keep practicing to improve."}
          {percentage < 60 && "📚 Keep learning! You'll get there."}
        </p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="text-primary hover:underline"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}
