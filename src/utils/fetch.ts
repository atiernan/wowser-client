type ResponseBodyType = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'

export default async (path: string, bodyType: ResponseBodyType = 'text' ) => {
  // TODO: Does this path need to be normalized?
  const resolvedPath = `${import.meta.env.VITE_GAME_ASSET_URL}${path}`;
  const response = await fetch(resolvedPath);
  if (response.status === 200) {
    return response[bodyType]();
  } else {
    throw new Error(`Could not load ${path}: ${response.statusText}`);
  }
};
