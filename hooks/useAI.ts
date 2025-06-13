import { useState } from 'react';

interface AIContext {
  tasksCount: number;
  completedTasks: number;
  notesCount: number;
  journalEntriesCount: number;
  recentMoods: string[];
  overdueTasks: number;
}

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, context?: AIContext): Promise<string> => {
    setIsLoading(true);
    
    try {
      const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
      const model = process.env.EXPO_PUBLIC_OPENROUTER_MODEL || 'openai/gpt-4';

      if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      const systemPrompt = `You are a helpful AI productivity assistant for J-Planner, a personal productivity app. 
      
User's current data:
- Total tasks: ${context?.tasksCount || 0}
- Completed tasks: ${context?.completedTasks || 0}
- Total notes: ${context?.notesCount || 0}
- Journal entries: ${context?.journalEntriesCount || 0}
- Recent moods: ${context?.recentMoods?.join(', ') || 'None'}
- Overdue tasks: ${context?.overdueTasks || 0}

You help with:
- Task organization and prioritization
- Productivity insights and patterns
- Journal reflection and analysis
- Note summarization and organization
- Goal setting and planning
- Habit recommendations
- Time management advice

Be encouraging, practical, and personalized. Keep responses concise but helpful. If asked about specific data you don't have access to, explain that you can only see summary statistics.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://j-planner.app',
          'X-Title': 'J-Planner',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('AI request error:', error);
      
      // Fallback responses for common scenarios
      if (message.toLowerCase().includes('productivity')) {
        return `Based on your ${context?.tasksCount || 0} tasks with ${context?.completedTasks || 0} completed, you're making good progress! Consider prioritizing your ${context?.overdueTasks || 0} overdue tasks first, then tackle high-priority items. Break large tasks into smaller steps for better momentum.`;
      }
      
      if (message.toLowerCase().includes('plan') && message.toLowerCase().includes('day')) {
        return `Here's a suggested daily plan:
        
1. Start with your overdue tasks (${context?.overdueTasks || 0} pending)
2. Focus on 3-5 high-priority tasks
3. Schedule breaks between tasks
4. Review your journal for mood patterns
5. Plan tomorrow before ending your day

Remember to stay flexible and adjust as needed!`;
      }
      
      return 'I\'m having trouble connecting to my AI services right now. Please try again in a moment, or feel free to explore your tasks, notes, and journal in the meantime.';
    } finally {
      setIsLoading(false);
    }
  };

  const generateTaskBreakdown = async (taskTitle: string, taskDescription?: string): Promise<string[]> => {
    const message = `Break down this task into smaller, actionable steps: "${taskTitle}"${taskDescription ? ` - ${taskDescription}` : ''}`;
    
    try {
      const response = await sendMessage(message);
      // Parse the response into an array of steps
      const steps = response.split('\n').filter(line => line.trim().length > 0);
      return steps;
    } catch (error) {
      return [
        'Review task requirements',
        'Gather necessary resources',
        'Create action plan',
        'Execute first step',
        'Review and adjust as needed'
      ];
    }
  };

  const generateJournalPrompts = async (mood?: string): Promise<string[]> => {
    const message = `Generate 3 thoughtful journal prompts${mood ? ` for someone feeling ${mood}` : ''}`;
    
    try {
      const response = await sendMessage(message);
      const prompts = response.split('\n').filter(line => line.trim().length > 0);
      return prompts.slice(0, 3);
    } catch (error) {
      return [
        'What are three things you\'re grateful for today?',
        'What challenge did you overcome recently?',
        'What would make tomorrow better than today?'
      ];
    }
  };

  return {
    sendMessage,
    generateTaskBreakdown,
    generateJournalPrompts,
    isLoading,
  };
};