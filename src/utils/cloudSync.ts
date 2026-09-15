import { supabase } from '../lib/supabase';
import { UserProgress } from '../types/quantum';
import { AdaptiveState } from './adaptive';

interface LearningRow {
  user_id: string;
  progress: UserProgress;
  adaptive: AdaptiveState;
  updated_at: string;
}

export async function loadLearningState(userId: string) {
  const { data, error } = await supabase
    .from('learning_state')
    .select('user_id, progress, adaptive, updated_at')
    .eq('user_id', userId)
    .maybeSingle<LearningRow>();

  if (error) throw error;
  return data;
}

export async function saveLearningState(userId: string, progress: UserProgress, adaptive: AdaptiveState) {
  const { error } = await supabase
    .from('learning_state')
    .upsert({
      user_id: userId,
      progress,
      adaptive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;
}
