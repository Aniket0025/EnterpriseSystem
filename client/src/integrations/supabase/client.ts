// Mock Supabase Client
// This file replaces the actual Supabase client so that we don't have to remove 
// data fetching logic from every single page and component. It returns empty arrays
// or stub responses to keep the application functioning on mocked data.

const createMockChain = (isSingle = false) => {
  const chain: any = {
    select: () => chain,
    order: () => chain,
    eq: () => chain,
    in: () => chain,
    gte: () => chain,
    lte: () => chain,
    limit: () => chain,
    single: () => createMockChain(true),
    
    // Mutations
    insert: () => Promise.resolve({ data: {}, error: null }),
    update: () => {
      const updateChain: any = {
        eq: () => Promise.resolve({ data: {}, error: null }),
        in: () => Promise.resolve({ data: {}, error: null }),
        then: (resolve: any) => Promise.resolve({ data: {}, error: null }).then(resolve)
      };
      return updateChain;
    },
    delete: () => {
      const delChain: any = {
        eq: () => delChain,
        in: () => delChain,
        then: (resolve: any) => Promise.resolve({ data: null, error: null }).then(resolve)
      };
      return delChain;
    },
    
    // Resolving queries
    then: (resolve: any) => {
      const response = isSingle ? { data: {}, error: null } : { data: [], error: null };
      return Promise.resolve(response).then(resolve);
    }
  };
  return chain;
};

export const supabase = {
  from: (table: string) => createMockChain(false),
  
  // Auth methods mock
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  }
};
