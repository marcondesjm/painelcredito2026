import { Play } from 'lucide-react';
import { useState } from 'react';

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm group">
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
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary glow-primary flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-0.5 sm:ml-1" fill="currentColor" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-background/80 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                <span className="text-xs sm:text-sm text-foreground">2:45</span>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/ZMG1gklPEac?autoplay=1&modestbranding=1&showinfo=0&rel=0&controls=1&iv_load_policy=3"
              title="Tutorial Completo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
      </div>
    </section>
  );
};
