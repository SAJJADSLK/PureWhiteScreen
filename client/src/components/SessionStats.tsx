import { motion } from "framer-motion";
import { BarChart3, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SessionStat {
  toolName: string;
  usageCount: number;
  totalTime: number; // in seconds
  lastUsed: Date;
}

interface SessionStatsProps {
  stats: SessionStat[];
  isLoading?: boolean;
}

export default function SessionStats({ stats, isLoading = false }: SessionStatsProps) {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const totalSessions = stats.reduce((sum, s) => sum + s.usageCount, 0);
  const totalTime = stats.reduce((sum, s) => sum + s.totalTime, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-32 bg-white/10 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Sessions</p>
                <p className="text-3xl font-bold text-white mt-1">{totalSessions}</p>
              </div>
              <Zap className="text-purple-400" size={32} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Total Time</p>
                <p className="text-3xl font-bold text-white mt-1">{formatDuration(totalTime)}</p>
              </div>
              <Clock className="text-cyan-400" size={32} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Avg Session</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {totalSessions > 0 ? formatDuration(totalTime / totalSessions) : "0s"}
                </p>
              </div>
              <BarChart3 className="text-green-400" size={32} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Tools */}
      {stats.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-cyan-400" />
              Top Tools
            </h3>

            <div className="space-y-3">
              {stats
                .sort((a, b) => b.usageCount - a.usageCount)
                .slice(0, 5)
                .map((stat, index) => {
                  const maxUsage = Math.max(...stats.map((s) => s.usageCount));
                  const percentage = (stat.usageCount / maxUsage) * 100;

                  return (
                    <motion.div
                      key={stat.toolName}
                      variants={itemVariants}
                      className="space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {index + 1}. {stat.toolName}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-cyan-400">
                            {stat.usageCount} uses
                          </p>
                          <p className="text-xs text-white/40">{formatDuration(stat.totalTime)}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {stats.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/5 border-white/10 p-12 text-center">
            <BarChart3 className="mx-auto text-white/20 mb-4" size={48} />
            <p className="text-white/60">No session data yet</p>
            <p className="text-sm text-white/40 mt-2">
              Start using tools to see your statistics here
            </p>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
