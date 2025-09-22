'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApiGet, useApiPost } from '@/hooks/use-api';
import { ApiProxy } from '@/lib/api-proxy';

// Configuration du proxy pour les tests
const testApiProxy = new ApiProxy({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
});

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

export default function ApiTestComponent() {
  const [testResults, setTestResults] = useState<string[]>([]);

  // Hook pour récupérer les posts
  const {
    data: posts,
    loading: loadingPosts,
    error: postsError,
    execute: fetchPosts
  } = useApiGet<Post[]>(
    '/posts',
    testApiProxy,
    {
      skipAuth: true, // API publique, pas besoin d'auth
      onSuccess: (data) => addTestResult(`✅ GET réussi: ${data.length} posts récupérés`),
      onError: (error) => addTestResult(`❌ GET échoué: ${error}`)
    }
  );

  // Hook pour créer un post
  const {
    data: newPost,
    loading: creatingPost,
    error: createError,
    mutate: createPost
  } = useApiPost<Post, CreatePostData>(
    '/posts',
    testApiProxy,
    {
      skipAuth: true,
      onSuccess: (data) => addTestResult(`✅ POST réussi: Post créé avec l'ID ${data.id}`),
      onError: (error) => addTestResult(`❌ POST échoué: ${error}`)
    }
  );

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${result}`]);
  };

  const testManualRequests = async () => {
    try {
      addTestResult('🔄 Test des requêtes manuelles...');

      // Test GET
      const postsData = await testApiProxy.get<Post[]>('/posts', { skipAuth: true });
      addTestResult(`✅ GET manuel: ${postsData.length} posts`);

      // Test POST
      const newPostData = await testApiProxy.post<Post>('/posts', {
        title: 'Test Post',
        body: 'Ceci est un test',
        userId: 1
      }, { skipAuth: true });
      addTestResult(`✅ POST manuel: Post créé avec l'ID ${newPostData.id}`);

      // Test PUT
      const updatedPost = await testApiProxy.put<Post>('/posts/1', {
        id: 1,
        title: 'Post modifié',
        body: 'Contenu modifié',
        userId: 1
      }, { skipAuth: true });
      addTestResult(`✅ PUT manuel: Post ${updatedPost.id} modifié`);

      // Test DELETE
      await testApiProxy.delete('/posts/1', { skipAuth: true });
      addTestResult('✅ DELETE manuel: Post supprimé');

    } catch (error) {
      addTestResult(`❌ Erreur dans les tests manuels: ${error}`);
    }
  };

  const testWithAuth = async () => {
    try {
      addTestResult('🔄 Test avec authentification...');

      // Tenter une requête qui nécessite l'auth (simulé)
      await testApiProxy.get('/posts');
      addTestResult('✅ Requête avec auth réussie');

    } catch (error) {
      addTestResult(`ℹ️ Requête avec auth: ${error} (normal sans token)`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test du Proxy API</CardTitle>
          <CardDescription>
            Test des fonctionnalités du proxy API avec gestion automatique des tokens Keycloak
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tests avec hooks */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tests avec React Hooks</h3>
            <div className="flex gap-2">
              <Button
                onClick={fetchPosts}
                disabled={loadingPosts}
                variant="outline"
              >
                {loadingPosts ? 'Chargement...' : 'GET Posts (Hook)'}
              </Button>

              <Button
                onClick={() => createPost({
                  title: 'Nouveau post via hook',
                  body: 'Contenu créé avec le hook useApiPost',
                  userId: 1
                })}
                disabled={creatingPost}
                variant="outline"
              >
                {creatingPost ? 'Création...' : 'POST Post (Hook)'}
              </Button>
            </div>

            {postsError && (
              <div className="text-red-600 text-sm">Erreur GET: {postsError}</div>
            )}
            {createError && (
              <div className="text-red-600 text-sm">Erreur POST: {createError}</div>
            )}
          </div>

          {/* Tests manuels */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tests Manuels</h3>
            <div className="flex gap-2">
              <Button onClick={testManualRequests} variant="outline">
                Tester toutes les méthodes HTTP
              </Button>
              <Button onClick={testWithAuth} variant="outline">
                Test avec authentification
              </Button>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex gap-2">
            <Button onClick={clearResults} variant="destructive" size="sm">
              Effacer les résultats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats des Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Aucun test exécuté</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Données récupérées */}
      {posts && (
        <Card>
          <CardHeader>
            <CardTitle>Posts récupérés ({posts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="border rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">#{post.id}</Badge>
                    <span className="text-sm text-gray-500">User {post.userId}</span>
                  </div>
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm text-gray-600 truncate">{post.body}</p>
                </div>
              ))}
              {posts.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  ... et {posts.length - 5} autres posts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {newPost && (
        <Card>
          <CardHeader>
            <CardTitle>Dernier post créé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">#{newPost.id}</Badge>
                <span className="text-sm text-gray-500">User {newPost.userId}</span>
              </div>
              <h4 className="font-semibold">{newPost.title}</h4>
              <p className="text-sm text-gray-600">{newPost.body}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}