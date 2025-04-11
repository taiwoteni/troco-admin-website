import AdminProvider from '@/providers/AdminProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
