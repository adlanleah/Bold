import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JoinConfig } from '../../Services/Join/join-config';
import { Merch, MerchItem } from '../../Services/Merch/merch';

// Define Category type locally in this file
type Category = 'all' | 'shirt' | 'hoodie' | 'accessory' | 'other';

@Component({
  selector: 'app-wear',
  imports: [RouterLink],
  templateUrl: './wear.html',
  styleUrl: './wear.scss',
})
export class Wear {
  private merchSvc   = inject(Merch);
  private joinConfig = inject(JoinConfig);

  activeCategory = signal<Category>('all');
  shopFormUrl    = computed(() => this.joinConfig.getUrl('wear').trim());
  allItems       = this.merchSvc.items;

  currency = signal<'UGX' | 'USD'>('UGX');
  readonly UGX_RATE = 3700; 

formatPrice(priceUSD: number): string {
  if (this.currency() === 'USD') {
    return `$${priceUSD.toFixed(2)}`;
  }
  const ugx = Math.round(priceUSD * this.UGX_RATE / 1000) * 1000;
  return `UGX ${ugx.toLocaleString()}`;
}

  filteredItems = computed(() => {
    const cat   = this.activeCategory();
    const items = this.allItems();
    if (cat === 'all') return items;
    return items.filter(i => i.category === cat);
  });

  featuredItem = computed(() =>
    this.allItems().find(i => i.inStock) ?? null
  );

  countFor(cat: Category): number {
    if (cat === 'all') return this.allItems().length;
    return this.allItems().filter(i => i.category === cat).length;
  }

  categories: { key: Category; label: string; icon: string }[] = [
    { key: 'all',       label: 'All Items',   icon: 'apps' },
    { key: 'shirt',     label: 'Shirts',      icon: 'dry_cleaning' },
    { key: 'hoodie',    label: 'Hoodies',     icon: 'checkroom' },
    { key: 'accessory', label: 'Accessories', icon: 'diamond' },
    { key: 'other',     label: 'Other',       icon: 'inventory_2' },
  ];

  orderItem(item: MerchItem) {
    const url = this.shopFormUrl();
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }
}
