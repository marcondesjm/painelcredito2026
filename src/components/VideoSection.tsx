import { Play } from 'lucide-react';
import { useState } from 'react';

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-gradient">🎬 Como Funciona</span>
        </h2>
        
        <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm group">
          {!isPlaying ? (
            <div className="relative">
              <img
                src="https://img.youtube.com/vi/ZMG1gklPEac/maxresdefault.jpg"
                alt="Como Funciona - Vídeo Tutorial"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-primary glow-primary flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-sm text-foreground">2:45</span>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/ZMG1gklPEac?autoplay=1"
              title="Tutorial Completo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
        <p className="text-center text-muted-foreground mt-4">
          Tutorial Completo - Veja como é fácil usar o painel
        </p>
      </div>
    </section>
  );
};
