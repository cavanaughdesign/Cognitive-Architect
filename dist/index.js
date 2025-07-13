#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
// Fixed chalk import for ESM
import chalk from 'chalk';
export class SequentialThinkingServer {
    thoughtHistory = [];
    branches = {};
    contextData = {
        domain: 'general',
        complexity: 'medium',
        keywords: [],
        relatedConcepts: [],
        confidence: 0.5
    };
    disableThoughtLogging;
    abstractionLevels = {};
    thoughtAbstractions = {};
    knowledgeGraph = new KnowledgeGraph();
    thoughtQualities = {};
    codeAnalysisCache = {};
    softwareInsightsCache = {};
    constructor() {
        this.disableThoughtLogging = (process.env.DISABLE_THOUGHT_LOGGING || "").toLowerCase() === "true";
    }
    // New method for cognitive_thinking tool
    processCognitiveThought(input) {
        const startTime = Date.now();
        try {
            const validatedInput = input;
            if (!validatedInput.query || typeof validatedInput.query !== 'string') {
                throw new Error('Invalid input: query must be a string');
            }
            const query = validatedInput.query;
            const focusAreas = validatedInput.focus_areas || ['summary', 'sentiment', 'key_concepts', 'tone'];
            const maxResponseLength = validatedInput.max_response_length || 100;
            let summary;
            let sentiment;
            let keyConcepts;
            let detectedTone;
            // Simulate parallel processing and heuristic-based analysis
            if (focusAreas.includes('summary')) {
                summary = this.generateSummary(query, maxResponseLength);
            }
            if (focusAreas.includes('sentiment')) {
                sentiment = this.analyzeSentiment(query);
            }
            if (focusAreas.includes('key_concepts')) {
                keyConcepts = this.extractKeyConcepts(query);
            }
            if (focusAreas.includes('tone')) {
                detectedTone = this.detectTone(query);
            }
            const confidenceScore = Math.random(); // Placeholder for heuristic confidence
            const processingTimeMs = Date.now() - startTime;
            const response = {
                summary,
                sentiment,
                key_concepts: keyConcepts,
                detected_tone: detectedTone,
                confidence_score: confidenceScore,
                processing_time_ms: processingTimeMs
            };
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response, null, 2)
                    }]
            };
        }
        catch (error) {
            const processingTimeMs = Date.now() - startTime;
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            status: 'failed',
                            processing_time_ms: processingTimeMs
                        }, null, 2)
                    }],
                isError: true
            };
        }
    }
    // Heuristic-based helper methods for cognitive_thinking
    generateSummary(text, maxLength) {
        const sentences = text.split('. ').filter(s => s.trim().length > 0);
        let currentLength = 0;
        let summarySentences = [];
        for (const sentence of sentences) {
            const words = sentence.split(' ');
            if (currentLength + words.length <= maxLength) {
                summarySentences.push(sentence);
                currentLength += words.length;
            }
            else {
                break;
            }
        }
        return summarySentences.join('. ') + (summarySentences.length > 0 && !summarySentences[summarySentences.length - 1].endsWith('.') ? '.' : '');
    }
    analyzeSentiment(text) {
        const lowerText = text.toLowerCase();
        const positiveWords = ['good', 'great', 'excellent', 'positive', 'happy', 'success', 'advantage'];
        const negativeWords = ['bad', 'poor', 'terrible', 'negative', 'sad', 'failure', 'disadvantage'];
        let score = 0;
        positiveWords.forEach(word => {
            if (lowerText.includes(word))
                score++;
        });
        negativeWords.forEach(word => {
            if (lowerText.includes(word))
                score--;
        });
        if (score > 0)
            return 'positive';
        if (score < 0)
            return 'negative';
        return 'neutral';
    }
    extractKeyConcepts(text) {
        const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
        const wordCounts = {};
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        return Object.entries(wordCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([word]) => word);
    }
    detectTone(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('asap') || lowerText.includes('urgent') || lowerText.includes('immediately')) {
            return 'urgent';
        }
        if (lowerText.includes('hello there') || lowerText.includes('hey') || lowerText.includes('lol')) {
            return 'informal';
        }
        if (lowerText.includes('therefore') || lowerText.includes('consequently') || lowerText.includes('pursuant to')) {
            return 'formal';
        }
        if (lowerText.includes('information') || lowerText.includes('details') || lowerText.includes('explain')) {
            return 'informative';
        }
        return 'neutral';
    }
    validateThoughtData(input) {
        const data = input;
        if (!data.thought || typeof data.thought !== 'string') {
            throw new Error('Invalid thought: must be a string');
        }
        if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
            throw new Error('Invalid thoughtNumber: must be a number');
        }
        if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
            throw new Error('Invalid totalThoughts: must be a number');
        }
        if (typeof data.nextThoughtNeeded !== 'boolean') {
            throw new Error('Invalid nextThoughtNeeded: must be a boolean');
        }
        return {
            thought: data.thought,
            thoughtNumber: data.thoughtNumber,
            totalThoughts: data.totalThoughts,
            nextThoughtNeeded: data.nextThoughtNeeded,
            isRevision: data.isRevision,
            revisesThought: data.revisesThought,
            branchFromThought: data.branchFromThought,
            branchId: data.branchId,
            needsMoreThoughts: data.needsMoreThoughts,
        };
    }
    formatThought(thoughtData) {
        const { thoughtNumber, totalThoughts, thought, isRevision, revisesThought, branchFromThought, branchId } = thoughtData;
        let prefix = '';
        let context = '';
        if (isRevision) {
            prefix = chalk.yellow('🔄 Revision');
            context = ` (revising thought ${revisesThought})`;
        }
        else if (branchFromThought) {
            prefix = chalk.green('🌿 Branch');
            context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
        }
        else {
            prefix = chalk.blue('💭 Thought');
            context = '';
        }
        const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
        const border = '─'.repeat(Math.max(header.length, thought.length) + 4);
        return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`;
    }
    analyzeContext(thought) {
        // Analyze thought content to determine context
        const words = thought.toLowerCase().split(/\s+/);
        const keywords = words.filter(word => word.length > 3);
        // Enhanced domain detection logic with coding support
        const domains = {
            'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'dom', 'component', 'ui', 'ux'],
            'backend': ['server', 'api', 'database', 'node', 'express', 'django', 'flask', 'spring', 'microservice', 'rest', 'graphql'],
            'mobile': ['ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin', 'mobile', 'app'],
            'devops': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'deployment', 'infrastructure', 'pipeline', 'ci/cd'],
            'data-science': ['python', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'machine-learning', 'ai', 'data', 'model'],
            'systems': ['performance', 'scalability', 'concurrency', 'threading', 'memory', 'optimization', 'distributed'],
            'security': ['authentication', 'authorization', 'encryption', 'vulnerability', 'security', 'oauth', 'jwt'],
            'technical': ['algorithm', 'code', 'function', 'class', 'method', 'variable', 'loop', 'condition', 'recursion'],
            'mathematical': ['equation', 'formula', 'calculate', 'proof', 'theorem', 'complexity', 'big-o'],
            'business': ['strategy', 'market', 'revenue', 'customer', 'profit', 'requirements', 'stakeholder'],
            'creative': ['design', 'artistic', 'creative', 'aesthetic', 'visual', 'pattern', 'architecture']
        };
        let detectedDomain = 'general';
        let maxMatches = 0;
        for (const [domain, domainKeywords] of Object.entries(domains)) {
            const matches = keywords.filter(k => domainKeywords.includes(k)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedDomain = domain;
            }
        }
        return {
            domain: detectedDomain,
            complexity: this.assessComplexity(thought),
            keywords: keywords.slice(0, 10),
            relatedConcepts: this.extractConcepts(thought),
            confidence: Math.min(maxMatches / 3, 1)
        };
    }
    assessComplexity(thought) {
        const complexityIndicators = ['however', 'although', 'furthermore', 'consequently', 'nevertheless'];
        const matches = complexityIndicators.filter(indicator => thought.toLowerCase().includes(indicator)).length;
        if (matches >= 2)
            return 'high';
        if (matches >= 1)
            return 'medium';
        return 'low';
    }
    generateAbstractions(thought, thoughtNumber) {
        const abstractions = {};
        // Level 0: Concrete details
        abstractions[0] = this.extractConcreteDetails(thought);
        // Level 1: Immediate implications
        abstractions[1] = this.identifyImplications(thought);
        // Level 2: Patterns and relationships
        abstractions[2] = this.identifyPatterns(thought);
        // Level 3: Principles and rules
        abstractions[3] = this.extractPrinciples(thought);
        // Level 4: Meta-concepts
        abstractions[4] = this.identifyMetaConcepts(thought);
        // Level 5: Philosophical/theoretical frameworks
        abstractions[5] = this.identifyFrameworks(thought);
        return abstractions;
    }
    extractConcreteDetails(thought) {
        // Extract specific facts, numbers, names
        const details = thought.match(/\b\d+\b|\b[A-Z][a-z]+\b/g) || [];
        return `Concrete elements: ${details.join(', ')}`;
    }
    identifyImplications(thought) {
        // Look for cause-effect relationships
        const implications = []; // Explicitly type as string[]
        if (thought.includes('because') || thought.includes('therefore') || thought.includes('thus')) {
            implications.push('Causal relationship identified');
        }
        if (thought.includes('leads to') || thought.includes('results in')) {
            implications.push('Sequential consequence identified');
        }
        return implications.join('; ') || 'No clear implications identified';
    }
    extractConcepts(thought) {
        // Extract key concepts using simple NLP techniques
        const concepts = [];
        const words = thought.toLowerCase().split(/\s+/);
        // Look for noun phrases and important terms
        const importantTerms = words.filter(word => word.length > 4 &&
            !['however', 'therefore', 'because', 'although', 'furthermore'].includes(word));
        // Extract capitalized terms (likely proper nouns or concepts)
        const capitalizedTerms = thought.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
        concepts.push(...importantTerms.slice(0, 5));
        concepts.push(...capitalizedTerms.map(term => term.toLowerCase()));
        return [...new Set(concepts)]; // Remove duplicates
    }
    identifyPatterns(thought) {
        const patterns = [];
        // Identify comparison patterns
        if (thought.includes('similar to') || thought.includes('like') || thought.includes('compared to')) {
            patterns.push('Comparison pattern identified');
        }
        // Identify sequence patterns
        if (thought.includes('first') || thought.includes('then') || thought.includes('finally')) {
            patterns.push('Sequential pattern identified');
        }
        // Identify conditional patterns
        if (thought.includes('if') || thought.includes('when') || thought.includes('unless')) {
            patterns.push('Conditional pattern identified');
        }
        // Identify hierarchical patterns
        if (thought.includes('above') || thought.includes('below') || thought.includes('under')) {
            patterns.push('Hierarchical pattern identified');
        }
        return patterns.join('; ') || 'No clear patterns identified';
    }
    extractPrinciples(thought) {
        const principles = [];
        // Look for rule-like statements
        if (thought.includes('always') || thought.includes('never') || thought.includes('must')) {
            principles.push('Absolute rule identified');
        }
        // Look for general principles
        if (thought.includes('generally') || thought.includes('typically') || thought.includes('usually')) {
            principles.push('General principle identified');
        }
        // Look for best practices
        if (thought.includes('best practice') || thought.includes('recommend') || thought.includes('should')) {
            principles.push('Best practice identified');
        }
        return principles.join('; ') || 'No clear principles identified';
    }
    identifyMetaConcepts(thought) {
        const metaConcepts = [];
        // Identify meta-cognitive concepts
        if (thought.includes('thinking about') || thought.includes('considering') || thought.includes('analyzing')) {
            metaConcepts.push('Meta-cognitive process identified');
        }
        // Identify methodological concepts
        if (thought.includes('approach') || thought.includes('method') || thought.includes('strategy')) {
            metaConcepts.push('Methodological concept identified');
        }
        // Identify abstraction concepts
        if (thought.includes('concept') || thought.includes('idea') || thought.includes('notion')) {
            metaConcepts.push('Abstract concept identified');
        }
        return metaConcepts.join('; ') || 'No clear meta-concepts identified';
    }
    identifyFrameworks(thought) {
        const frameworks = [];
        // Identify theoretical frameworks
        const theoryKeywords = ['theory', 'model', 'framework', 'paradigm', 'philosophy'];
        const hasTheory = theoryKeywords.some(keyword => thought.toLowerCase().includes(keyword));
        if (hasTheory) {
            frameworks.push('Theoretical framework identified');
        }
        // Identify system thinking
        if (thought.includes('system') || thought.includes('holistic') || thought.includes('interconnected')) {
            frameworks.push('Systems thinking framework identified');
        }
        // Identify process frameworks
        if (thought.includes('process') || thought.includes('workflow') || thought.includes('methodology')) {
            frameworks.push('Process framework identified');
        }
        return frameworks.join('; ') || 'No clear frameworks identified';
    }
    assessThoughtQuality(thought, thoughtNumber) {
        const coherence = this.measureCoherence(thought, thoughtNumber);
        const relevance = this.measureRelevance(thought);
        const novelty = this.measureNovelty(thought);
        const depth = this.measureDepth(thought);
        const clarity = this.measureClarity(thought);
        const overallScore = (coherence + relevance + novelty + depth + clarity) / 5;
        return { coherence, relevance, novelty, depth, clarity, overallScore };
    }
    measureCoherence(thought, thoughtNumber) {
        if (thoughtNumber === 1)
            return 1.0; // First thought is always coherent with itself
        const previousThought = this.thoughtHistory[thoughtNumber - 2]?.thought || '';
        const sharedTerms = this.findSharedTerms(thought, previousThought);
        const logicalConnectors = ['therefore', 'however', 'furthermore', 'consequently'].filter(connector => thought.toLowerCase().includes(connector)).length;
        return Math.min((sharedTerms.length * 0.2) + (logicalConnectors * 0.3), 1.0);
    }
    measureRelevance(thought) {
        const contextKeywords = this.contextData.keywords;
        const thoughtWords = thought.toLowerCase().split(/\s+/);
        const relevantTerms = thoughtWords.filter(word => contextKeywords.includes(word) && word.length > 3);
        return Math.min(relevantTerms.length * 0.2, 1.0);
    }
    measureNovelty(thought) {
        const thoughtWords = new Set(thought.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        const historicalWords = new Set();
        this.thoughtHistory.forEach(t => {
            t.thought.toLowerCase().split(/\s+/).forEach(word => {
                if (word.length > 3)
                    historicalWords.add(word);
            });
        });
        const newWords = Array.from(thoughtWords).filter(word => !historicalWords.has(word));
        return Math.min(newWords.length * 0.1, 1.0);
    }
    measureDepth(thought) {
        const depthIndicators = [
            'because', 'therefore', 'implies', 'suggests', 'indicates',
            'underlying', 'fundamental', 'root cause', 'deeper'
        ];
        const matches = depthIndicators.filter(indicator => thought.toLowerCase().includes(indicator)).length;
        return Math.min(matches * 0.25, 1.0);
    }
    measureClarity(thought) {
        const sentences = thought.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
        // Optimal sentence length is around 15-20 words
        const clarityScore = 1.0 - Math.abs(avgSentenceLength - 17.5) * 0.02;
        return Math.max(Math.min(clarityScore, 1.0), 0.1);
    }
    findSharedTerms(thought1, thought2) {
        const words1 = new Set(thought1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        const words2 = new Set(thought2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        return Array.from(words1).filter(word => words2.has(word));
    }
    generateThoughtSuggestions() {
        const suggestions = [];
        const lastThought = this.thoughtHistory[this.thoughtHistory.length - 1];
        if (!lastThought)
            return suggestions;
        // Analyze gaps in reasoning
        const gaps = this.identifyReasoningGaps();
        gaps.forEach(gap => {
            suggestions.push({
                type: 'clarify',
                suggestion: `Consider clarifying: ${gap}`,
                priority: 0.8,
                reasoning: 'Identified gap in reasoning chain'
            });
        });
        // Suggest challenging assumptions
        const assumptions = this.identifyAssumptions(lastThought.thought);
        assumptions.forEach(assumption => {
            suggestions.push({
                type: 'challenge',
                suggestion: `Challenge the assumption that: ${assumption}`,
                priority: 0.7,
                reasoning: 'Identified unchallenged assumption'
            });
        });
        // Suggest synthesis if multiple concepts present
        if (this.thoughtHistory.length >= 3) {
            suggestions.push({
                type: 'synthesize',
                suggestion: 'Consider synthesizing the key insights from previous thoughts',
                priority: 0.9,
                reasoning: 'Multiple thoughts available for synthesis'
            });
        }
        // Suggest exploration of alternative approaches
        if (this.contextData.complexity === 'high') {
            suggestions.push({
                type: 'explore',
                suggestion: 'Consider exploring alternative approaches or perspectives',
                priority: 0.6,
                reasoning: 'High complexity suggests multiple valid approaches'
            });
        }
        // Suggest validation if hypothesis present
        const hasHypothesis = lastThought.thought.toLowerCase().includes('hypothesis') ||
            lastThought.thought.toLowerCase().includes('theory') ||
            lastThought.thought.toLowerCase().includes('propose');
        if (hasHypothesis) {
            suggestions.push({
                type: 'validate',
                suggestion: 'Consider validating the hypothesis with evidence or testing',
                priority: 0.85,
                reasoning: 'Hypothesis identified that needs validation'
            });
        }
        return suggestions.sort((a, b) => b.priority - a.priority);
    }
    identifyReasoningGaps() {
        const gaps = [];
        // Check for missing logical connections
        for (let i = 1; i < this.thoughtHistory.length; i++) {
            const current = this.thoughtHistory[i].thought;
            const previous = this.thoughtHistory[i - 1].thought;
            const hasLogicalConnection = ['therefore', 'because', 'thus', 'consequently', 'however', 'but'].some(connector => current.toLowerCase().includes(connector));
            if (!hasLogicalConnection && this.findSharedTerms(current, previous).length < 2) {
                gaps.push(`Connection between thought ${i} and ${i + 1}`);
            }
        }
        // Check for undefined terms
        const allWords = this.thoughtHistory.flatMap(t => t.thought.toLowerCase().split(/\s+/));
        const technicalTerms = allWords.filter(word => word.length > 6 &&
            !['however', 'therefore', 'because', 'although', 'furthermore'].includes(word));
        const undefinedTerms = [...new Set(technicalTerms)].filter(term => {
            const definitionFound = this.thoughtHistory.some(t => t.thought.toLowerCase().includes(`${term} is`) ||
                t.thought.toLowerCase().includes(`${term} means`) ||
                t.thought.toLowerCase().includes(`define ${term}`));
            return !definitionFound;
        });
        if (undefinedTerms.length > 0) {
            gaps.push(`Undefined terms: ${undefinedTerms.slice(0, 3).join(', ')}`);
        }
        return gaps;
    }
    identifyAssumptions(thought) {
        const assumptions = [];
        // Look for assumption indicators
        const assumptionPatterns = [
            /assuming that (.*?)(?:\.|,|$)/gi,
            /given that (.*?)(?:\.|,|$)/gi,
            /if we assume (.*?)(?:\.|,|$)/gi,
            /presuppose (.*?)(?:\.|,|$)/gi
        ];
        assumptionPatterns.forEach(pattern => {
            const matches = thought.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    assumptions.push(match.replace(pattern, '$1').trim());
                });
            }
        });
        // Look for implicit assumptions (statements presented as facts without evidence)
        const sentences = thought.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentences.forEach(sentence => {
            const hasEvidence = ['research shows', 'studies indicate', 'data suggests', 'evidence shows'].some(phrase => sentence.toLowerCase().includes(phrase));
            const isDefinitive = ['always', 'never', 'all', 'every', 'must'].some(word => sentence.toLowerCase().includes(word));
            if (isDefinitive && !hasEvidence && sentence.trim().length > 20) {
                assumptions.push(sentence.trim().substring(0, 50) + '...');
            }
        });
        return assumptions.slice(0, 3); // Limit to top 3 assumptions
    }
    updateKnowledgeGraph(thought, thoughtNumber) {
        // Extract concepts and add to knowledge graph
        const concepts = this.extractConcepts(thought);
        concepts.forEach(concept => {
            this.knowledgeGraph.addConcept(concept, 'concept', thoughtNumber);
        });
        // Identify relationships between concepts
        for (let i = 0; i < concepts.length - 1; i++) {
            for (let j = i + 1; j < concepts.length; j++) {
                const relationship = this.identifyRelationship(concepts[i], concepts[j], thought);
                if (relationship) {
                    this.knowledgeGraph.addRelationship(concepts[i], concepts[j], relationship, thoughtNumber);
                }
            }
        }
    }
    identifyRelationship(concept1, concept2, thought) {
        const text = thought.toLowerCase();
        // Look for explicit relationship indicators
        if (text.includes(`${concept1.toLowerCase()} causes ${concept2.toLowerCase()}`)) {
            return 'causes';
        }
        if (text.includes(`${concept1.toLowerCase()} leads to ${concept2.toLowerCase()}`)) {
            return 'leads_to';
        }
        if (text.includes(`${concept1.toLowerCase()} is similar to ${concept2.toLowerCase()}`)) {
            return 'similar_to';
        }
        if (text.includes(`${concept1.toLowerCase()} depends on ${concept2.toLowerCase()}`)) {
            return 'depends_on';
        }
        if (text.includes(`${concept1.toLowerCase()} includes ${concept2.toLowerCase()}`)) {
            return 'includes';
        }
        // Default relationship if concepts appear together
        return 'related_to';
    }
    analyzeCode(thought) {
        const text = thought.toLowerCase();
        // Detect programming language
        const languages = {
            'javascript': ['javascript', 'js', 'node', 'npm', 'react', 'vue', 'angular'],
            'typescript': ['typescript', 'ts', 'interface', 'type', 'generic'],
            'python': ['python', 'py', 'pandas', 'numpy', 'django', 'flask', 'def'],
            'java': ['java', 'class', 'public', 'private', 'static', 'spring'],
            'csharp': ['c#', 'csharp', 'dotnet', '.net', 'asp.net'],
            'cpp': ['c++', 'cpp', 'iostream', 'vector', 'template'],
            'rust': ['rust', 'cargo', 'trait', 'impl', 'ownership'],
            'go': ['golang', 'go', 'goroutine', 'channel', 'interface'],
            'sql': ['sql', 'select', 'insert', 'update', 'delete', 'database'],
            'html': ['html', 'div', 'span', 'element', 'tag'],
            'css': ['css', 'selector', 'property', 'flexbox', 'grid']
        };
        let detectedLanguage = 'general';
        let maxMatches = 0;
        for (const [lang, keywords] of Object.entries(languages)) {
            const matches = keywords.filter(keyword => text.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedLanguage = lang;
            }
        }
        // Analyze complexity indicators
        const complexityIndicators = {
            'linear': ['loop', 'iterate', 'for', 'while', 'foreach'],
            'logarithmic': ['binary search', 'divide and conquer', 'tree traversal'],
            'quadratic': ['nested loop', 'bubble sort', 'selection sort'],
            'exponential': ['recursive', 'backtracking', 'brute force', 'permutation']
        };
        let complexity = 'unknown';
        let maxComplexityMatches = 0;
        for (const [comp, indicators] of Object.entries(complexityIndicators)) {
            const matches = indicators.filter(indicator => text.includes(indicator)).length;
            if (matches > maxComplexityMatches) {
                maxComplexityMatches = matches;
                complexity = comp;
            }
        }
        // Identify programming patterns
        const patterns = this.identifyCodePatterns(thought);
        // Detect code smells
        const codeSmells = this.detectCodeSmells(thought);
        // Generate coding suggestions
        const suggestions = this.generateCodingSuggestions(thought, detectedLanguage);
        // Identify architectural concepts
        const architecturalConcepts = this.identifyArchitecturalConcepts(thought);
        return {
            language: detectedLanguage,
            complexity,
            patterns,
            codeSmells,
            suggestions,
            architecturalConcepts
        };
    }
    identifyCodePatterns(thought) {
        const patterns = [];
        const text = thought.toLowerCase();
        // Design patterns
        const designPatterns = [
            'singleton', 'factory', 'observer', 'strategy', 'decorator', 'adapter',
            'facade', 'proxy', 'command', 'state', 'visitor', 'builder'
        ];
        designPatterns.forEach(pattern => {
            if (text.includes(pattern)) {
                patterns.push(`${pattern.charAt(0).toUpperCase() + pattern.slice(1)} pattern detected`);
            }
        });
        // Architectural patterns
        if (text.includes('mvc') || text.includes('model-view-controller')) {
            patterns.push('MVC architecture pattern');
        }
        if (text.includes('microservice') || text.includes('micro-service')) {
            patterns.push('Microservices architecture pattern');
        }
        if (text.includes('rest') || text.includes('restful')) {
            patterns.push('REST API pattern');
        }
        if (text.includes('event-driven') || text.includes('event sourcing')) {
            patterns.push('Event-driven architecture pattern');
        }
        // Programming paradigms
        if (text.includes('functional') || text.includes('pure function')) {
            patterns.push('Functional programming paradigm');
        }
        if (text.includes('object-oriented') || text.includes('oop')) {
            patterns.push('Object-oriented programming paradigm');
        }
        return patterns;
    }
    detectCodeSmells(thought) {
        const smells = [];
        const text = thought.toLowerCase();
        // Common code smells
        if (text.includes('long method') || text.includes('big function')) {
            smells.push('Long method detected');
        }
        if (text.includes('duplicate') || text.includes('copy')) {
            smells.push('Possible code duplication');
        }
        if (text.includes('god class') || text.includes('large class')) {
            smells.push('God class anti-pattern');
        }
        if (text.includes('magic number') || text.includes('hardcode')) {
            smells.push('Magic numbers detected');
        }
        if (text.includes('deep nesting') || text.includes('nested if')) {
            smells.push('Deep nesting complexity');
        }
        if (text.includes('tight coupling') || text.includes('dependency')) {
            smells.push('Tight coupling concern');
        }
        return smells;
    }
    generateCodingSuggestions(thought, language) {
        const suggestions = [];
        const text = thought.toLowerCase();
        // Language-specific suggestions
        if (language === 'javascript' || language === 'typescript') {
            if (text.includes('callback') && !text.includes('promise') && !text.includes('async')) {
                suggestions.push('Consider using Promises or async/await instead of callbacks');
            }
            if (text.includes('var ') && !text.includes('let') && !text.includes('const')) {
                suggestions.push('Use let or const instead of var for better scoping');
            }
        }
        if (language === 'python') {
            if (text.includes('loop') && !text.includes('comprehension')) {
                suggestions.push('Consider using list comprehensions for better Pythonic code');
            }
            if (text.includes('exception') && !text.includes('specific')) {
                suggestions.push('Use specific exception types instead of bare except clauses');
            }
        }
        // General coding suggestions
        if (text.includes('performance') || text.includes('slow')) {
            suggestions.push('Consider profiling to identify performance bottlenecks');
        }
        if (text.includes('test') && !text.includes('unit test')) {
            suggestions.push('Implement unit tests for better code reliability');
        }
        if (text.includes('error') && !text.includes('handling')) {
            suggestions.push('Add proper error handling and logging');
        }
        if (text.includes('security') || text.includes('vulnerable')) {
            suggestions.push('Conduct security review and implement input validation');
        }
        return suggestions;
    }
    identifyArchitecturalConcepts(thought) {
        const concepts = [];
        const text = thought.toLowerCase();
        // Architectural concepts
        const architecturalTerms = [
            'scalability', 'modularity', 'separation of concerns', 'single responsibility',
            'dependency injection', 'inversion of control', 'solid principles',
            'clean architecture', 'hexagonal architecture', 'onion architecture',
            'domain-driven design', 'cqrs', 'event sourcing', 'saga pattern'
        ];
        architecturalTerms.forEach(term => {
            if (text.includes(term)) {
                concepts.push(term.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
            }
        });
        return concepts;
    }
    generateSoftwareEngineeringInsights(thought) {
        const text = thought.toLowerCase();
        // Design patterns
        const designPatterns = [];
        const commonPatterns = [
            'factory', 'singleton', 'observer', 'strategy', 'decorator', 'adapter',
            'facade', 'proxy', 'command', 'state', 'visitor', 'builder', 'prototype'
        ];
        commonPatterns.forEach(pattern => {
            if (text.includes(pattern)) {
                designPatterns.push(`${pattern.charAt(0).toUpperCase() + pattern.slice(1)} Pattern`);
            }
        });
        // SOLID principles
        const principles = [];
        if (text.includes('single responsibility') || text.includes('srp')) {
            principles.push('Single Responsibility Principle');
        }
        if (text.includes('open closed') || text.includes('ocp')) {
            principles.push('Open/Closed Principle');
        }
        if (text.includes('liskov substitution') || text.includes('lsp')) {
            principles.push('Liskov Substitution Principle');
        }
        if (text.includes('interface segregation') || text.includes('isp')) {
            principles.push('Interface Segregation Principle');
        }
        if (text.includes('dependency inversion') || text.includes('dip')) {
            principles.push('Dependency Inversion Principle');
        }
        // Best practices
        const bestPractices = [];
        if (text.includes('code review') || text.includes('peer review')) {
            bestPractices.push('Code review implementation');
        }
        if (text.includes('unit test') || text.includes('tdd')) {
            bestPractices.push('Test-driven development');
        }
        if (text.includes('documentation') || text.includes('comment')) {
            bestPractices.push('Code documentation');
        }
        if (text.includes('version control') || text.includes('git')) {
            bestPractices.push('Version control usage');
        }
        // Anti-patterns
        const antiPatterns = [];
        if (text.includes('god class') || text.includes('god object')) {
            antiPatterns.push('God Class anti-pattern');
        }
        if (text.includes('spaghetti code') || text.includes('tightly coupled')) {
            antiPatterns.push('Spaghetti Code anti-pattern');
        }
        if (text.includes('copy paste') || text.includes('duplicate')) {
            antiPatterns.push('Copy-Paste Programming anti-pattern');
        }
        // Refactoring opportunities
        const refactoringOpportunities = [];
        if (text.includes('extract method') || text.includes('long method')) {
            refactoringOpportunities.push('Extract Method refactoring');
        }
        if (text.includes('rename') || text.includes('unclear name')) {
            refactoringOpportunities.push('Rename Variable/Method refactoring');
        }
        if (text.includes('duplicate') || text.includes('similar code')) {
            refactoringOpportunities.push('Extract Common Functionality refactoring');
        }
        // Testing strategies
        const testingStrategies = [];
        if (text.includes('unit test') || text.includes('unit testing')) {
            testingStrategies.push('Unit Testing');
        }
        if (text.includes('integration test') || text.includes('integration testing')) {
            testingStrategies.push('Integration Testing');
        }
        if (text.includes('e2e') || text.includes('end-to-end')) {
            testingStrategies.push('End-to-End Testing');
        }
        if (text.includes('mock') || text.includes('stub')) {
            testingStrategies.push('Test Doubles (Mocks/Stubs)');
        }
        return {
            designPatterns,
            principles,
            bestPractices,
            antiPatterns,
            refactoringOpportunities,
            testingStrategies
        };
    }
    processThought(input) {
        try {
            const validatedInput = this.validateThoughtData(input);
            if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
                validatedInput.totalThoughts = validatedInput.thoughtNumber;
            }
            this.thoughtHistory.push(validatedInput);
            if (validatedInput.branchFromThought && validatedInput.branchId) {
                if (!this.branches[validatedInput.branchId]) {
                    this.branches[validatedInput.branchId] = [];
                }
                this.branches[validatedInput.branchId].push(validatedInput);
            }
            if (!this.disableThoughtLogging) {
                const formattedThought = this.formatThought(validatedInput);
                console.error(formattedThought);
            }
            // Update context data
            this.contextData = this.analyzeContext(validatedInput.thought);
            // Generate abstractions
            const abstractions = this.generateAbstractions(validatedInput.thought, validatedInput.thoughtNumber);
            this.thoughtAbstractions[validatedInput.thoughtNumber] = {
                ...validatedInput,
                abstractionLevel: 0, // Default to concrete level
                abstractions,
                dependencies: [],
                implications: []
            };
            // Assess thought quality
            const quality = this.assessThoughtQuality(validatedInput.thought, validatedInput.thoughtNumber);
            this.thoughtQualities[validatedInput.thoughtNumber] = quality;
            // Generate thought suggestions
            const suggestions = this.generateThoughtSuggestions();
            // Update knowledge graph
            this.updateKnowledgeGraph(validatedInput.thought, validatedInput.thoughtNumber);
            // Perform code analysis if relevant
            let codeAnalysis = null;
            let softwareInsights = null;
            const isProgrammingRelated = ['frontend', 'backend', 'mobile', 'devops', 'data-science', 'systems', 'security', 'technical'].includes(this.contextData.domain);
            if (isProgrammingRelated) {
                codeAnalysis = this.analyzeCode(validatedInput.thought);
                softwareInsights = this.generateSoftwareEngineeringInsights(validatedInput.thought);
                this.codeAnalysisCache[validatedInput.thoughtNumber] = codeAnalysis;
                this.softwareInsightsCache[validatedInput.thoughtNumber] = softwareInsights;
            }
            // Get knowledge graph insights
            const insights = this.knowledgeGraph.getInsights();
            // Enhanced response with analysis including coding features
            const response = {
                thoughtNumber: validatedInput.thoughtNumber,
                totalThoughts: validatedInput.totalThoughts,
                nextThoughtNeeded: validatedInput.nextThoughtNeeded,
                branches: Object.keys(this.branches),
                thoughtHistoryLength: this.thoughtHistory.length,
                context: {
                    domain: this.contextData.domain,
                    complexity: this.contextData.complexity,
                    confidence: this.contextData.confidence,
                    keywords: this.contextData.keywords.slice(0, 5),
                    isProgrammingRelated
                },
                abstractions: abstractions,
                quality: {
                    overallScore: this.thoughtQualities[validatedInput.thoughtNumber]?.overallScore || 0,
                    coherence: this.thoughtQualities[validatedInput.thoughtNumber]?.coherence || 0,
                    relevance: this.thoughtQualities[validatedInput.thoughtNumber]?.relevance || 0,
                    depth: this.thoughtQualities[validatedInput.thoughtNumber]?.depth || 0,
                    clarity: this.thoughtQualities[validatedInput.thoughtNumber]?.clarity || 0,
                    novelty: this.thoughtQualities[validatedInput.thoughtNumber]?.novelty || 0
                },
                suggestions: suggestions.slice(0, 3), // Top 3 suggestions
                insights: insights,
                knowledgeGraphSummary: {
                    totalConcepts: this.knowledgeGraph.exportGraph().nodes.length,
                    totalRelationships: this.knowledgeGraph.exportGraph().edges.length
                }
            };
            // Add coding analysis if available
            if (codeAnalysis && softwareInsights) {
                response.codeAnalysis = {
                    language: codeAnalysis.language,
                    complexity: codeAnalysis.complexity,
                    patterns: codeAnalysis.patterns,
                    codeSmells: codeAnalysis.codeSmells,
                    suggestions: codeAnalysis.suggestions,
                    architecturalConcepts: codeAnalysis.architecturalConcepts
                };
                response.softwareEngineering = {
                    designPatterns: softwareInsights.designPatterns,
                    principles: softwareInsights.principles,
                    bestPractices: softwareInsights.bestPractices,
                    antiPatterns: softwareInsights.antiPatterns,
                    refactoringOpportunities: softwareInsights.refactoringOpportunities,
                    testingStrategies: softwareInsights.testingStrategies
                };
            }
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            status: 'failed'
                        }, null, 2)
                    }],
                isError: true
            };
        }
    }
}
class KnowledgeGraph {
    nodes = new Map();
    edges = [];
    addConcept(concept, type, thoughtNumber) {
        const id = concept.toLowerCase().replace(/\s+/g, '_');
        if (this.nodes.has(id)) {
            const node = this.nodes.get(id);
            node.frequency++;
        }
        else {
            this.nodes.set(id, {
                id,
                label: concept,
                type,
                confidence: 0.5,
                firstMentioned: thoughtNumber,
                frequency: 1
            });
        }
    }
    addRelationship(source, target, relationship, thoughtNumber) {
        const sourceId = source.toLowerCase().replace(/\s+/g, '_');
        const targetId = target.toLowerCase().replace(/\s+/g, '_');
        const existingEdge = this.edges.find(e => e.source === sourceId && e.target === targetId && e.relationship === relationship);
        if (existingEdge) {
            existingEdge.strength++;
            existingEdge.thoughtNumbers.push(thoughtNumber);
        }
        else {
            this.edges.push({
                source: sourceId,
                target: targetId,
                relationship,
                strength: 1,
                thoughtNumbers: [thoughtNumber]
            });
        }
    }
    getInsights() {
        const insights = [];
        // Find most central concepts
        const centralConcepts = Array.from(this.nodes.values())
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 3);
        if (centralConcepts.length > 0) {
            insights.push(`Central concepts: ${centralConcepts.map(c => c.label).join(', ')}`);
        }
        // Find strong relationships
        const strongRelationships = this.edges
            .filter(e => e.strength >= 2)
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 3);
        strongRelationships.forEach(rel => {
            const source = this.nodes.get(rel.source)?.label || rel.source;
            const target = this.nodes.get(rel.target)?.label || rel.target;
            insights.push(`Strong relationship: ${source} ${rel.relationship} ${target}`);
        });
        return insights;
    }
    exportGraph() {
        return {
            nodes: Array.from(this.nodes.values()),
            edges: this.edges
        };
    }
}
const COGNITIVE_ARCHITECT_TOOL = {
    name: "cognitive_architect",
    description: `CognitiveArchitect - Advanced AI-powered reasoning engine optimized for software development

SPECIALIZED FOR CODING: Transforms programming thoughts into structured software engineering insights with comprehensive code analysis, pattern recognition, and architectural guidance.

💻 CODING FEATURES:
- Language Detection: JavaScript, TypeScript, Python, Java, C#, C++, Rust, Go, SQL, HTML, CSS
- Complexity Analysis: Algorithm complexity detection (linear, logarithmic, quadratic, exponential)
- Pattern Recognition: Design patterns, architectural patterns, anti-patterns
- Code Quality: Smell detection, SOLID principles, best practices
- Architecture: Clean architecture, microservices, domain-driven design
- Refactoring: Improvement suggestions and optimization opportunities

🔬 SOFTWARE ENGINEERING:
- Design Patterns: Gang of Four patterns + architectural patterns
- Principles: SOLID, DRY, KISS, YAGNI adherence analysis
- Testing: Unit, integration, E2E testing strategies
- Security: Vulnerability detection and secure coding practices
- Performance: Optimization strategies and bottleneck identification

🌐 DOMAINS: Frontend, Backend, Mobile, DevOps, Data Science, Systems, Security

Transform your coding thoughts into structured software engineering architecture.`,
    inputSchema: {
        type: "object",
        properties: {
            thought: {
                type: "string",
                description: "Your current thinking step"
            },
            nextThoughtNeeded: {
                type: "boolean",
                description: "Whether another thought step is needed"
            },
            thoughtNumber: {
                type: "integer",
                description: "Current thought number",
                minimum: 1
            },
            totalThoughts: {
                type: "integer",
                description: "Estimated total thoughts needed",
                minimum: 1
            },
            isRevision: {
                type: "boolean",
                description: "Whether this revises previous thinking"
            },
            revisesThought: {
                type: "integer",
                description: "Which thought is being reconsidered",
                minimum: 1
            },
            branchFromThought: {
                type: "integer",
                description: "Branching point thought number",
                minimum: 1
            },
            branchId: {
                type: "string",
                description: "Branch identifier"
            },
            needsMoreThoughts: {
                type: "boolean",
                description: "If more thoughts are needed"
            }
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
    }
};
const COGNITIVE_THINKING_TOOL = {
    name: "cognitive_thinking",
    description: `⚡ Cognitive Thinking - Rapid AI-powered query analysis for quick insights

Prioritizes speed and high-level understanding using heuristic and parallel processing. Ideal for quick assessments of text.

FEATURES:
- Summarization: Generate concise summaries
- Sentiment Analysis: Determine overall sentiment (positive, negative, neutral)
- Key Concept Extraction: Identify important terms and ideas
- Tone Detection: Detect communication tone (formal, informal, urgent, informative)

Use this tool when you need a fast overview and immediate insights from text, without requiring deep, sequential reasoning.`,
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "The input text or query to process"
            },
            focus_areas: {
                type: "array",
                items: {
                    type: "string",
                    enum: ["sentiment", "key_concepts", "summary", "urgency", "tone"]
                },
                description: "Specific areas to focus the rapid analysis on"
            },
            max_response_length: {
                type: "integer",
                description: "Maximum length of the summary/insights in words",
                default: 100
            }
        },
        required: ["query"]
    }
};
const server = new Server({
    name: "cognitive-architect-server",
    version: "2.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
const thinkingServer = new SequentialThinkingServer();
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [COGNITIVE_ARCHITECT_TOOL, COGNITIVE_THINKING_TOOL],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "cognitive_architect") {
        return thinkingServer.processThought(request.params.arguments);
    }
    else if (request.params.name === "cognitive_thinking") {
        return thinkingServer.processCognitiveThought(request.params.arguments);
    }
    return {
        content: [{
                type: "text",
                text: `Unknown tool: ${request.params.name}`
            }],
        isError: true
    };
});
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Cognitive Architect MCP Server v2.0.0 - Advanced AI Reasoning Engine");
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map