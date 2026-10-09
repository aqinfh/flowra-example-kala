import Link from "next/link";
import { Photo } from "@/components/photo";
import { LineItem, Ticket, TicketTitle } from "@/components/ticket";

type CoffeeCardProps = {
  name: string;
  slug: string;
  tasting_notes: string;
  price: string;
  image: string | null;
  roast?: string;
  tilt?: number;
};

/** A coffee as a ticket on the rail: photo, name, notes, and priced lines. */
export function CoffeeCard({ name, slug, tasting_notes, price, image, roast, tilt = 0 }: CoffeeCardProps) {
  return (
    <Ticket tilt={tilt} className="h-full">
      {image && (
        <Photo src={image} alt="" aspect="aspect-square" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
      )}
      <TicketTitle className="mt-4">
        <Link href={`/coffees/${slug}`} className="after:absolute after:inset-0 hover:underline">
          {name}
        </Link>
      </TicketTitle>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{tasting_notes}</p>
      <div className="mt-4 space-y-1.5">
        {roast && <LineItem label="Roast" value={roast} />}
        <LineItem label="Price" value={price} strong />
      </div>
    </Ticket>
  );
}
