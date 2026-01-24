"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BadgeCheck, HelpCircle, MessageSquare } from "lucide-react";
import { useState } from "react";

interface Question {
    id: string;
    text: string;
    status: string;
    itemTitle?: string;
    itemId: string;
    dateCreated: string;
    suggestedAnswer?: string;
    answer?: string;
}

interface QuestionsHubProps {
    questions: Question[];
    onApprove: (id: string, text: string) => void;
}

export function QuestionsHub({ questions, onApprove }: QuestionsHubProps) {
    const [editingAnswers, setEditingAnswers] = useState<Record<string, string>>({});

    const pendingQuestions = questions.filter(q => q.status !== 'ANSWERED');

    return (
        <Card className="glass-card h-full flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-yellow-500" />
                    Central de Perguntas
                </h2>
                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold">
                    {pendingQuestions.length} PENDENTES
                </span>
            </div>
            
            <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                {questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                        <BadgeCheck className="h-10 w-10 text-gray-700 mb-3" />
                        <p className="text-sm text-gray-500">Caixa de entrada limpa!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {questions.map(q => (
                            <div key={q.id} className={cn(
                                "p-6 transition-colors hover:bg-white/5",
                                q.status === 'DRAFT_CREATED' && "bg-yellow-500/[0.02]"
                            )}>
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        {q.status === 'ANSWERED' ? (
                                            <div className="p-2 bg-green-500/10 rounded-lg">
                                                <BadgeCheck className="h-5 w-5 text-green-500" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                                <HelpCircle className="h-5 w-5 text-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-white leading-snug">{q.text}</p>
                                            <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(q.dateCreated), { addSuffix: true, locale: ptBR })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                            {q.itemTitle}
                                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono">{q.itemId}</span>
                                        </p>

                                        {/* Action Area */}
                                        {q.status !== 'ANSWERED' && (
                                            <div className="mt-3 bg-black/20 rounded-lg p-3 border border-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-primary-glow uppercase tracking-wider">
                                                        {q.suggestedAnswer ? "Sugestão ArtorIA" : "Sua Resposta"}
                                                    </span>
                                                </div>
                                                <textarea
                                                    className="w-full bg-transparent text-sm text-gray-300 focus:outline-none resize-none placeholder:text-gray-600"
                                                    rows={2}
                                                    placeholder="Escreva sua resposta..."
                                                    value={editingAnswers[q.id] ?? (q.suggestedAnswer || "")}
                                                    onChange={(e) => setEditingAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                />
                                                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-white/5">
                                                    <Button 
                                                        size="sm" 
                                                        className="h-7 text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                                                        onClick={() => onApprove(q.id, editingAnswers[q.id] || q.suggestedAnswer || "")}
                                                        disabled={!editingAnswers[q.id] && !q.suggestedAnswer}
                                                    >
                                                        Enviar Resposta
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {q.status === 'ANSWERED' && (
                                            <p className="text-xs text-gray-500 mt-2 pl-2 border-l-2 border-green-500/30">
                                                Respondido: <span className="text-gray-400 italic">"{q.answer}"</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
