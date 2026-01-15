import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Trophy,
  Star,
  Users,
  Clock,
  Zap,
  Brain,
  Puzzle,
  Target,
} from "lucide-react";

const Games = () => {
  const games = [
    {
      id: 1,
      name: "Quiz Master",
      description: "Test your knowledge with subject-based quizzes",
      icon: Brain,
      players: "1.2K playing",
      category: "Educational",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Word Puzzle",
      description: "Challenge your vocabulary with word puzzles",
      icon: Puzzle,
      players: "856 playing",
      category: "Word Game",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Speed Math",
      description: "Race against time to solve math problems",
      icon: Zap,
      players: "645 playing",
      category: "Math",
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: 4,
      name: "Memory Match",
      description: "Match pairs and test your memory skills",
      icon: Target,
      players: "423 playing",
      category: "Memory",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 15420, avatar: "SC" },
    { rank: 2, name: "Alex Kumar", points: 14280, avatar: "AK" },
    { rank: 3, name: "Maya Patel", points: 13650, avatar: "MP" },
    { rank: 4, name: "Raj Sharma", points: 12890, avatar: "RS" },
    { rank: 5, name: "John Smith", points: 11540, avatar: "JS" },
  ];

  const dailyChallenge = {
    name: "Science Trivia",
    description: "Answer 10 science questions to earn bonus points!",
    reward: 500,
    timeLeft: "4h 23m",
    participants: 234,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Community Games</h1>
          <p className="text-muted-foreground">Take a break and have some fun!</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Games Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge */}
          <div className="glass-card p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">Daily Challenge</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-1">{dailyChallenge.name}</h3>
                <p className="text-muted-foreground">{dailyChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-warning mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold">+{dailyChallenge.reward}</span>
                </div>
                <p className="text-sm text-muted-foreground">{dailyChallenge.participants} playing</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Ends in {dailyChallenge.timeLeft}</span>
              </div>
              <Button variant="accent">
                Play Now
              </Button>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.id}
                  className="glass-card-hover p-5 animate-slide-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-muted-foreground">{game.category}</span>
                      <h3 className="font-display font-semibold text-lg mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {game.players}
                        </span>
                        <Button variant="hero" size="sm">
                          Play
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-warning" />
              <h3 className="font-display font-semibold">Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    player.rank === 1 ? 'bg-warning text-warning-foreground' :
                    player.rank === 2 ? 'bg-muted-foreground/30 text-foreground' :
                    player.rank === 3 ? 'bg-accent/30 text-accent' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {player.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-semibold">{player.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{player.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {player.points.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full Leaderboard
            </Button>
          </div>

          {/* Your Stats */}
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Points</span>
                <span className="font-bold text-lg gradient-text">8,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Global Rank</span>
                <span className="font-bold">#42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Games Played</span>
                <span className="font-bold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-bold text-success">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
