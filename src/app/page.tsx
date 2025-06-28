"use client";

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Logo } from '@/components/logo';
import { FileUploader } from '@/components/file-uploader';
import { FitDetails } from '@/components/fit-details';
import { ActivityChart } from '@/components/activity-chart';
import { PowerChart } from '@/components/power-chart';
import { sports, getSportByValue } from '@/lib/sports';

export type FitData = {
  activityType: string;
  sport: string;
  startTime: Date;
  duration: string;
  distance: number;
  avgPace?: string;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
};

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [fitData, setFitData] = useState<FitData | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.fit')) {
      toast({
        variant: "destructive",
        title: "Tipo de Archivo no Válido",
        description: "Por favor, sube un archivo .FIT válido.",
      });
      return;
    }
    setFile(selectedFile);
    setStatus('loading');

    // Mock processing the FIT file
    setTimeout(() => {
      const mockData: FitData = {
        activityType: 'Running',
        sport: 'running',
        startTime: new Date(),
        duration: '01:05:23',
        distance: 10.2,
        avgPace: "6:25 min/km",
        calories: 750,
        avgHeartRate: 158,
        maxHeartRate: 175,
      };
      setFitData(mockData);
      setSelectedSport(mockData.sport);
      setStatus('loaded');
    }, 1500);
  };

  const handleDownload = () => {
    if (!file) return;

    // This is a mock download. In a real app, you would generate a new,
    // modified FIT file with the updated sport. Here, we just download the original file.
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSport}_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Descarga Iniciada",
      description: `Tu archivo modificado ${a.download} se está descargando.`,
    })
  };

  const handleReset = () => {
    setStatus('idle');
    setFile(null);
    setFitData(null);
    setSelectedSport('');
  };

  const selectedSportData = useMemo(() => getSportByValue(selectedSport), [selectedSport]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 font-body">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mt-4 font-headline">
            FITscribe
          </h1>
          <p className="text-md sm:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Sube un archivo <span className="font-semibold text-primary">.FIT</span>, edita el deporte y descarga tu actividad actualizada.
          </p>
        </div>

        <Card className="w-full transition-all duration-500 ease-in-out shadow-lg rounded-xl">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div key="idle" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <FileUploader onFileSelect={handleFileSelect} />
                </motion.div>
              )}
              {status === 'loading' && (
                <motion.div key="loading" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="flex flex-col items-center justify-center space-y-4 h-64">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-muted-foreground">Analizando tu actividad...</p>
                </motion.div>
              )}
              {status === 'loaded' && fitData && (
                <motion.div key="loaded" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                  <div className="flex items-center mb-6">
                    <Button variant="ghost" size="icon" onClick={handleReset} className="mr-2">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-2xl font-semibold font-headline">Editar Actividad</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground font-headline">Detalles de la Actividad</h3>
                      <FitDetails data={fitData} />
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground font-headline">Modificar Deporte</h3>
                      <div className="space-y-2">
                        <Label htmlFor="sport-select" className="text-base">Deporte</Label>
                        <Select onValueChange={setSelectedSport} value={selectedSport}>
                          <SelectTrigger id="sport-select" className="w-full h-12 text-base">
                            <SelectValue>
                              {selectedSportData ? (
                                <div className="flex items-center gap-3">
                                  <selectedSportData.icon className="h-5 w-5 text-primary" />
                                  <span>{selectedSportData.label}</span>
                                </div>
                              ) : 'Selecciona un deporte'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {sports.map((sport) => (
                              <SelectItem key={sport.value} value={sport.value} className="text-base">
                                <div className="flex items-center gap-3">
                                  <sport.icon className="h-5 w-5 text-muted-foreground" />
                                  <span>{sport.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Button onClick={handleDownload} size="lg" className="w-full bg-accent text-accent-foreground text-base h-12 hover:bg-accent/90 focus-visible:ring-accent">
                          <Download className="mr-2 h-5 w-5" />
                          Descargar Nuevo Archivo .FIT
                        </Button>
                        <p className="text-xs text-center text-muted-foreground px-4">
                            Nota: Esta es una demostración. La descarga renombrará tu archivo original, pero el contenido del archivo .FIT no se modificará.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ActivityChart />
                    <PowerChart />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
            FITscribe es una herramienta de demostración y no almacena tus archivos.
        </p>
      </div>
    </main>
  );
}
