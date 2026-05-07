import { useParams } from 'react-router-dom';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  return <div className="text-blue-950">blog detail: {slug} (placeholder)</div>;
}
