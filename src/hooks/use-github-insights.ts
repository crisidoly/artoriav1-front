"use client";

import { useEffect, useState } from 'react';

export interface DashboardInsight {
    type: 'pr' | 'issue' | 'review' | 'system';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
    link?: string;
}

export function useGithubInsights() {
    const [insights, setInsights] = useState<DashboardInsight[]>([]);
    const [stats, setStats] = useState({
        pendingReviews: 0,
        openIssues: 0,
        uptime: 99.9
    });

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // Mocking for now, but structure is ready for:
                // const prs = await api.get('/github/search/issues?q=is:pr+is:open+review-requested:@me');
                // const issues = await api.get('/github/search/issues?q=is:issue+is:open+assignee:@me');
                
                // For immediate "wow" factor without waiting for real data connection (which might be empty):
                setInsights([
                    {
                        type: 'pr',
                        message: 'PR #12: Feature/New-Logo - Review Pending',
                        timestamp: '1h ago',
                        priority: 'high',
                        link: '#'
                    },
                    {
                        type: 'issue',
                        message: 'Issue #45: Sidebar mobile width incorrect',
                        timestamp: '3h ago',
                        priority: 'medium',
                        link: '#'
                    },
                    {
                        type: 'system',
                        message: 'System optimized: Memory usage down by 12%',
                        timestamp: '5h ago',
                        priority: 'low',
                        link: '#'
                    }
                ]);

                 setStats(prev => ({
                    ...prev,
                    pendingReviews: 3,
                    openIssues: 5
                }));

            } catch (e) {
                console.error("Failed to fetch insights", e);
            }
        };

        fetchInsights();
    }, []);

    return { insights, stats };
}
