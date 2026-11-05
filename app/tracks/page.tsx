import { redirect } from 'next/navigation';

export default function TracksPage() {
  redirect('/?display=grouped');
}
