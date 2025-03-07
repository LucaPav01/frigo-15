import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, MessageSquare, Share2, BookmarkPlus, MoreHorizontal, Search, Filter, TrendingUp, Award, Gift, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample user data
  const userData = {
    points: 1250,
    nextLevel: 1500,
    rank: 3,
  };

  // Sample leaderboard data
  const leaderboard = [
    {
      name: "Marco Rossi",
      points: 2800,
      avatar: "https://i.pravatar.cc/150?img=12",
      badge: "Chef"
    },
    {
      name: "Sofia Bianchi",
      points: 2450,
      avatar: "https://i.pravatar.cc/150?img=25",
      badge: "Food Expert"
    },
    {
      name: "Maria Rossi",
      points: 1250,
      avatar: "https://i.pravatar.cc/150?img=32",
      badge: "Chef"
    },
  ];

  // Sample community posts data
  const posts = [
    {
      id: 1,
      user: {
        name: "Maria Rossi",
        avatar: "https://i.pravatar.cc/150?img=32",
        badge: "Chef"
      },
      time: "2 ore fa",
      content: "Ho provato questa ricetta di lasagna vegetariana e devo dire che è stata un successo! La besciamella fatta con latte di mandorla è stata una rivelazione. Qualcuno ha altri suggerimenti per ricette vegetariane?",
      image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=2835&auto=format&fit=crop",
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ["vegetariano", "lasagna", "ricette"]
    },
    {
      id: 2,
      user: {
        name: "Luca Bianchi",
        avatar: "https://i.pravatar.cc/150?img=68",
        badge: "Nutrizionista"
      },
      time: "5 ore fa",
      content: "Consigli per una colazione equilibrata: proteine (uova o yogurt greco), carboidrati complessi (avena o pane integrale) e grassi sani (avocado o frutta secca). Qual è la vostra colazione preferita?",
      likes: 42,
      comments: 15,
      shares: 7,
      tags: ["colazione", "nutrizione", "salute"]
    },
    {
      id: 3,
      user: {
        name: "Giulia Verdi",
        avatar: "https://i.pravatar.cc/150?img=45",
        badge: ""
      },
      time: "1 giorno fa",
      content: "Oggi ho organizzato la mia dispensa con i nuovi contenitori ermetici. Incredibile quanto spazio ho guadagnato! Ecco una foto del prima e dopo.",
      image: "https://images.unsplash.com/photo-1606771833951-8e736669af99?q=80&w=2942&auto=format&fit=crop",
      likes: 18,
      comments: 4,
      shares: 1,
      tags: ["organizzazione", "dispensa", "cucina"]
    }
  ];
  
  // Sample challenges data
  const challenges = [
    {
      id: 1,
      title: "7 giorni senza zuccheri aggiunti",
      description: "Elimina gli zuccheri aggiunti dalla tua dieta per una settimana",
      participants: 345,
      image: "https://images.unsplash.com/photo-1621187390803-cffa8aa0a04a?q=80&w=2942&auto=format&fit=crop",
      level: "Intermedio",
      days: 7
    },
    {
      id: 2,
      title: "Cucina con 5 ingredienti",
      description: "Prepara pasti usando solo 5 ingredienti per 3 giorni",
      participants: 210,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2940&auto=format&fit=crop",
      level: "Facile",
      days: 3
    },
    {
      id: 3,
      title: "Meal prep del lunedì",
      description: "Prepara tutti i pasti della settimana in un giorno",
      participants: 178,
      image: "https://images.unsplash.com/photo-1545216560-68430ad77342?q=80&w=2940&auto=format&fit=crop",
      level: "Avanzato",
      days: 1
    }
  ];
  
  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="community"
    >
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Points and Rewards Section */}
        <Card className="bg-gradient-to-r from-purple-100 to-blue-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Trophy size={16} />
                  I tuoi punti
                </div>
                <div className="text-3xl font-bold">{userData.points}</div>
                <div className="w-48">
                  <Progress value={(userData.points / userData.nextLevel) * 100} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {userData.nextLevel - userData.points} punti al prossimo livello
                  </p>
                </div>
              </div>
              <Button className="bg-[#F97316] hover:bg-[#EA580C]">
                <Gift className="mr-2" size={18} />
                Riscatta premi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Cerca nella community..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={16} />
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
        
        <Tabs defaultValue="feed" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="challenges">Sfide</TabsTrigger>
            <TabsTrigger value="leaderboard">Classifica</TabsTrigger>
            <TabsTrigger value="groups">Gruppi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed">
            <Card className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="https://i.pravatar.cc/150?img=15" />
                    <AvatarFallback>TU</AvatarFallback>
                  </Avatar>
                  <Input placeholder="Condividi qualcosa con la community..." className="ml-3 bg-muted" />
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-2 flex justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Foto
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Ricetta
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Sondaggio
                </Button>
              </CardFooter>
            </Card>
            
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-3">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>{post.user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <CardTitle className="text-base">{post.user.name}</CardTitle>
                            {post.user.badge && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {post.user.badge}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-xs">{post.time}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={18} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-3">
                    <p className="mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags && post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    {post.image && (
                      <div className="mt-3 -mx-4">
                        <img 
                          src={post.image} 
                          alt="Post media" 
                          className="w-full aspect-video object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 border-t grid grid-cols-4">
                    <Button variant="ghost" size="sm" className="flex items-center justify-center gap-1">
                      <ThumbsUp size={16} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center justify-center gap-1">
                      <MessageSquare size={16} />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center justify-center gap-1">
                      <Share2 size={16} />
                      <span>{post.shares || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center justify-center">
                      <BookmarkPlus size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nessun post trovato</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="challenges">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map(challenge => (
                <Card key={challenge.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-40">
                    <img 
                      src={challenge.image} 
                      alt={challenge.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 hover:bg-black/70 flex items-center gap-1">
                        <Target size={12} /> {challenge.participants} partecipanti
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {challenge.title}
                      <Badge variant="secondary" className="ml-auto">
                        +{challenge.days * 100} punti
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full text-xs">
                        {challenge.level}
                      </Badge>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {challenge.days} {challenge.days === 1 ? 'giorno' : 'giorni'}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">Partecipa</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <Card key={user.name} className={cn(
                  "transition-transform hover:scale-[1.01]",
                  index === 0 ? "bg-gradient-to-r from-yellow-50 to-amber-50" : ""
                )}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="font-bold text-xl w-8">{index + 1}</div>
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{user.name}</div>
                        {user.badge && (
                          <Badge variant="outline" className="text-xs">
                            {user.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.points} punti
                      </div>
                    </div>
                    {index === 0 && <Trophy className="text-amber-500" size={24} />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="groups">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Nessun gruppo ancora</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Unisciti a gruppi di utenti con interessi simili o crea il tuo gruppo per condividere ricette e consigli
              </p>
              <div className="flex justify-center gap-4">
                <Button>Sfoglia gruppi</Button>
                <Button variant="outline">Crea un gruppo</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Community;
