"use client";

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { es } from "date-fns/locale";
import FitParser from 'fit-file-parser';

import { Logo } from '@/components/logo';
import { FileUploader } from '@/components/file-uploader';
import { FitDetails } from '@/components/fit-details';
import { ActivityChart } from '@/components/activity-chart';
import { PowerChart } from '@/components/power-chart';
import { sports, getSportByValue } from '@/lib/sports';
import { summarizeActivity } from '@/ai/flows/summarize-activity-flow';

export type FitData = {
  activityType: string;
  subSport?: string;
  sport: string;
  startTime: Date;
  duration: string;
  distance: number;
  avgPace?: string;
  calories?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
};

export type ChartDataItem = {
  kilometer: string;
  pace: number;
  power: number;
};

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [fitData, setFitData] = useState<FitData | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const formatDuration = (seconds: number) => {
    if (isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatPace = (speed_mps: number) => {
    if (!speed_mps || speed_mps <= 0) return "N/A";
    const pace_spm = 16.6667 / speed_mps;
    const pace_min = Math.floor(pace_spm);
    const pace_sec = Math.round((pace_spm - pace_min) * 60).toString().padStart(2, '0');
    return `${pace_min}:${pace_sec} min/km`;
  };

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

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const fitParser = new FitParser({
                force: true,
                speedUnit: 'm/s',
                lengthUnit: 'm',
                temperatureUnit: 'celsius',
                elapsedRecordField: true,
                mode: 'cascade',
            });

            const buffer = e.target?.result;
            if (!buffer) {
                throw new Error("File buffer is empty.");
            }
            
            fitParser.parse(buffer, (error: any, data: any) => {
                if (error) {
                    console.error("Error parsing FIT file:", error);
                    toast({
                        variant: "destructive",
                        title: "Error al Leer el Archivo",
                        description: "No se pudo procesar el archivo .FIT. Puede que esté corrupto o en un formato no compatible.",
                    });
                    setStatus('idle');
                    return;
                }

                if (!data || Object.keys(data).length === 0) {
                    toast({
                        variant: "destructive",
                        title: "Archivo Vacío",
                        description: "El archivo .FIT no parece contener ninguna información.",
                    });
                    setStatus('idle');
                    return;
                }

                const mainData = data.activity || data;
                let session;

                if (mainData.sessions && mainData.sessions.length > 0) {
                    session = mainData.sessions[0];
                } else if (mainData.laps && mainData.laps.length > 0) {
                    session = mainData.laps[mainData.laps.length - 1];
                }

                if (!session && mainData.records && mainData.records.length > 0) {
                    const records = mainData.records;
                    const firstRecord = records[0];
                    const lastRecord = records[records.length - 1];

                    if (firstRecord.timestamp && lastRecord.timestamp) {
                        const totalTime = lastRecord.timer_time || lastRecord.elapsed_time || ((lastRecord.timestamp.getTime() - firstRecord.timestamp.getTime()) / 1000);
                        const totalDistance = lastRecord.distance || 0;
                        const avgSpeed = (totalTime > 0 && totalDistance > 0) ? (totalDistance / totalTime) : 0;
                        const heartRateRecords = records.map((r: any) => r.heart_rate).filter((hr: any) => typeof hr === 'number' && hr > 0);
                        const avgHeartRate = heartRateRecords.length > 0
                            ? Math.round(heartRateRecords.reduce((sum: number, hr: number) => sum + hr, 0) / heartRateRecords.length)
                            : undefined;
                        const maxHeartRate = heartRateRecords.length > 0
                            ? Math.max(...heartRateRecords)
                            : undefined;
                        const sportInfo = mainData.sports?.[0] || { sport: 'generic', sub_sport: undefined };

                        session = {
                            sport: sportInfo.sport,
                            sub_sport: sportInfo.sub_sport,
                            start_time: firstRecord.timestamp,
                            total_timer_time: totalTime,
                            total_distance: totalDistance,
                            avg_speed: avgSpeed,
                            total_calories: lastRecord.calories,
                            avg_heart_rate: avgHeartRate,
                            max_heart_rate: maxHeartRate,
                        };
                    }
                }

                if (!session) {
                    toast({
                        variant: "destructive",
                        title: "No se Encontraron Datos",
                        description: "El archivo no contiene datos de actividad válidos.",
                    });
                    setStatus('idle');
                    return;
                }

                const sportInfo = getSportByValue(session.sport) || getSportByValue('generic');

                const newFitData: FitData = {
                    activityType: sportInfo?.label || 'Actividad',
                    subSport: session.sub_sport,
                    sport: sportInfo?.value || 'generic',
                    startTime: session.start_time,
                    duration: formatDuration(session.total_timer_time),
                    distance: parseFloat(((session.total_distance || 0) / 1000).toFixed(2)),
                    avgPace: session.avg_speed ? formatPace(session.avg_speed) : undefined,
                    calories: session.total_calories,
                    avgHeartRate: session.avg_heart_rate,
                    maxHeartRate: session.max_heart_rate,
                };

                setFitData(newFitData);
                setSelectedSport(newFitData.sport);
                setSummary(null);

                // Process records for charts
                setChartData([]);
                if (mainData.records && mainData.records.length > 0) {
                    const kmData: { [key: number]: { speeds: number[], powers: number[] } } = {};

                    for (const record of mainData.records) {
                        if (record.distance === undefined || record.distance === null || record.speed === undefined || record.speed === null) continue;

                        const km = Math.floor(record.distance / 1000) + 1;
                        if (!kmData[km]) {
                            kmData[km] = { speeds: [], powers: [] };
                        }
                        if (record.speed > 0) {
                           kmData[km].speeds.push(record.speed);
                        }
                        if (record.power !== undefined && record.power !== null) {
                            kmData[km].powers.push(record.power);
                        }
                    }

                    const perKmStats = Object.keys(kmData).map(kmStr => {
                        const km = parseInt(kmStr, 10);
                        const data = kmData[km];
                        
                        const avgSpeed = data.speeds.length > 0 ? data.speeds.reduce((a, b) => a + b, 0) / data.speeds.length : 0;
                        const avgPaceInSeconds = avgSpeed > 0 ? (1 / avgSpeed) * 1000 : 0;
                        
                        const avgPower = data.powers.length > 0
                            ? data.powers.reduce((a, b) => a + b, 0) / data.powers.length
                            : 0;
                        
                        return {
                            kilometer: km.toString(),
                            pace: Math.round(avgPaceInSeconds),
                            power: Math.round(avgPower)
                        };
                    });

                    setChartData(perKmStats);
                }

                setStatus('loaded');
            });

        } catch (err) {
            console.error("FIT Parser failed", err);
            toast({
                variant: "destructive",
                title: "Error Crítico",
                description: "Ocurrió un error inesperado al procesar el archivo.",
            });
            setStatus('idle');
        }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Error de Lectura",
            description: "No se pudo leer el archivo seleccionado.",
        });
        setStatus('idle');
    }
    reader.readAsArrayBuffer(selectedFile);
  };
  
  const selectedSportData = useMemo(() => getSportByValue(selectedSport), [selectedSport]);

  const handleGenerateSummary = async () => {
    if (!fitData || !selectedSportData) return;
    setIsGenerating(true);
    setSummary(null);
    try {
      const result = await summarizeActivity({
        activityData: { ...fitData, startTime: fitData.startTime.toISOString() },
        selectedSportLabel: selectedSportData.label,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Error de la IA",
        description: "No se pudo generar el resumen. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFile(null);
    setFitData(null);
    setSelectedSport('');
    setSummary(null);
    setChartData([]);
  };

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
            Sube un archivo <span className="font-semibold text-primary">.FIT</span>, edita el deporte y obtén un resumen de tu actividad con IA.
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
                    <h2 className="text-2xl font-semibold font-headline">Revisa tu Actividad</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground font-headline">Detalles de la Actividad</h3>
                      <FitDetails data={fitData} />
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground font-headline">Modificar y Resumir</h3>
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
                        <Button onClick={handleGenerateSummary} size="lg" className="w-full bg-accent text-accent-foreground text-base h-12 hover:bg-accent/90 focus-visible:ring-accent" disabled={isGenerating}>
                          {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                          {isGenerating ? 'Generando...' : 'Generar Resumen con IA'}
                        </Button>
                      </div>

                      {isGenerating && (
                        <div className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
                          <p className="text-muted-foreground">La IA está calentando para escribir tu resumen...</p>
                        </div>
                      )}

                      {summary && !isGenerating && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-headline text-primary">
                                        <Sparkles className="h-5 w-5" />
                                        Resumen de tu Actividad
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-foreground whitespace-pre-wrap">{summary}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                      )}

                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ActivityChart data={chartData} />
                    <PowerChart data={chartData} />
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
