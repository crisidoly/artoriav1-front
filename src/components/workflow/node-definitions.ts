
import { Bot, Split, Terminal, Zap } from "lucide-react";

export interface NodeDefinition {
    type: string;
    label: string;
    category: 'trigger' | 'action' | 'ai' | 'logic' | 'utility';
    icon: any;
    description: string;
    defaultData: any;
    inputs: { id: string; label: string }[];
    outputs: { id: string; label: string }[];
    properties: PropertySchema[];
}

export interface PropertySchema {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'code' | 'json';
    options?: { label: string; value: string }[];
    placeholder?: string;
    helperText?: string;
    defaultValue?: any;
}

export const NODE_DEFINITIONS: Record<string, NodeDefinition> = {
    // === TRIGGERS ===
    'trigger': {
        type: 'trigger',
        label: 'Trigger',
        category: 'trigger',
        icon: Zap,
        description: 'Start the workflow.',
        defaultData: { subType: 'manual', cron: '0 * * * *', method: 'POST', path: '/webhook' },
        inputs: [],
        outputs: [{ id: 'output', label: 'Start' }],
        properties: [
            { 
                name: 'subType', 
                label: 'Trigger Mode', 
                type: 'select', 
                options: [
                    { label: 'Manual Button', value: 'manual' },
                    { label: 'Webhook', value: 'webhook' },
                    { label: 'Schedule (Cron)', value: 'cron' }
                ] 
            },
            // Webhook Props
            { name: 'method', label: 'Method', type: 'select', options: [{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }] },
            { name: 'path', label: 'Path', type: 'text', placeholder: '/webhook/...' },
            // Cron Props
            { name: 'cron', label: 'Cron Expression', type: 'text', placeholder: '* * * * *' }
        ]
    },

    // === AI ===
    'ai-agent': {
        type: 'ai-agent',
        label: 'AI Agent',
        category: 'ai',
        icon: Bot,
        description: 'Process text using an LLM.',
        defaultData: { model: 'gpt-4o', temperature: 0.7 },
        inputs: [{ id: 'input', label: 'Context' }],
        outputs: [{ id: 'output', label: 'Response' }],
        properties: [
            { name: 'model', label: 'Model', type: 'select', options: [
                { label: 'GPT-4o', value: 'gpt-4o' },
                { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
                { label: 'Gemini Pro', value: 'gemini-pro' }
            ]},
            { name: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'You are a helpful assistant...' },
            { name: 'temperature', label: 'Temperature', type: 'number', defaultValue: 0.7 }
        ]
    },

    // === ACTIONS ===
    'action': {
        type: 'action',
        label: 'Action',
        category: 'action',
        icon: Terminal,
        description: 'Perform an operation.',
        defaultData: { subType: 'http', method: 'GET', url: 'https://' },
        inputs: [{ id: 'input', label: 'Trigger' }],
        outputs: [{ id: 'success', label: 'Success' }, { id: 'error', label: 'Error' }],
        properties: [
             { 
                name: 'subType', 
                label: 'Action Type', 
                type: 'select', 
                options: [
                    { label: 'HTTP Request', value: 'http' },
                    { label: 'Manage Finance', value: 'finance' },
                ] 
            },
            // HTTP Props
            { name: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com' },
            { name: 'method', label: 'Method', type: 'select', options: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' }
            ]},
            { name: 'headers', label: 'Headers (JSON)', type: 'json' },
            { name: 'body', label: 'Body (JSON)', type: 'json' },
            // Finance Props
            { name: 'amount', label: 'Amount', type: 'number' },
            { name: 'financeCategory', label: 'Category', type: 'text' },
        ]
    },

    // === LOGIC ===
    'logic': {
        type: 'logic',
        label: 'Logic Flow',
        category: 'logic',
        icon: Split,
        description: 'Control the flow of execution.',
        defaultData: { subType: 'if', condition: 'true', code: '// return data' },
        inputs: [{ id: 'input', label: 'Data' }],
        outputs: [{ id: 'true', label: 'True' }, { id: 'false', label: 'False' }],
        properties: [
             { 
                name: 'subType', 
                label: 'Control Type', 
                type: 'select', 
                options: [
                    { label: 'If / Else Condition', value: 'if' },
                    { label: 'Run Javascript', value: 'code' },
                ] 
            },
            { name: 'expression', label: 'Condition (JS for If)', type: 'code', placeholder: 'input.status === 200' },
            { name: 'code', label: 'Script (for Code)', type: 'code', defaultValue: 'return input;' }
        ]
    },

    // === SYSTEM TOOLS ===
    'system-tool': {
        type: 'system-tool',
        label: 'System Tool',
        category: 'action', // Broadly fits as an action
        icon: Terminal,
        description: 'Execute a system capability.',
        defaultData: { toolName: '' },
        inputs: [{ id: 'input', label: 'Trigger' }],
        outputs: [{ id: 'success', label: 'Success' }, { id: 'error', label: 'Error' }],
        properties: [
            {
                name: 'toolName',
                label: 'Select Tool',
                type: 'select',
                options: [] // Populated dynamically in PropertyPanel
            }
        ]
    }
};

export const NODE_CATEGORIES = [
    { id: 'trigger', label: 'Triggers', icon: Zap },
    { id: 'ai', label: 'AI Intelligence', icon: Bot },
    { id: 'action', label: 'Actions', icon: Terminal },
    { id: 'logic', label: 'Flow Logic', icon: Split },
];
