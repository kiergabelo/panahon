export type City = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
};

export const cities: City[] = [
  { id: "cebu", name: "Cebu City", region: "Central Visayas", lat: 10.3157, lng: 123.8854 },
  { id: "manila", name: "Manila", region: "NCR", lat: 14.5995, lng: 120.9842 },
  { id: "davao", name: "Davao City", region: "Davao Region", lat: 7.1907, lng: 125.4553 },
  { id: "cdo", name: "Cagayan de Oro", region: "Northern Mindanao", lat: 8.4542, lng: 124.6319 },
  { id: "iloilo", name: "Iloilo City", region: "Western Visayas", lat: 10.7202, lng: 122.5621 },
  { id: "baguio", name: "Baguio City", region: "Cordillera", lat: 16.4023, lng: 120.596 },
  { id: "bacolod", name: "Bacolod City", region: "Western Visayas", lat: 10.6765, lng: 122.9505 },
  { id: "general-santos", name: "Gen. Santos", region: "SOCCSKSARGEN", lat: 6.1164, lng: 125.1714 },
];

export const defaultCity = cities[0]!;
