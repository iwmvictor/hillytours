import { Search, MapPin, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px] -mt-8 flex items-center">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
          alt="Beautiful landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl mb-8">
              Explore unique places to stay, exceptional experiences, and hidden
              gems around the world.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full border-none focus:ring-0 text-lg"
                  />
                </div>
              </div>
              <Button size="lg" className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <div className="flex items-center space-x-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              <span>Updated daily</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-64">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{listing.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${listing.price}</span>
                    <Button>View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    name: "Hotels & Resorts",
    description: "Luxury stays and comfortable accommodations",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
  {
    name: "Tours & Activities",
    description: "Guided adventures and local experiences",
    image:
      "https://images.pexels.com/photos/17824132/pexels-photo-17824132/free-photo-of-hill-in-the-hobbiton-movie-set.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    name: "Restaurants",
    description: "Fine dining and local cuisine",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  },
  {
    name: "Real Estate",
    description: "Properties for sale and rent",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
  },
];

const featuredListings = [
  {
    id: 1,
    title: "Luxury Beach Resort",
    description: "Experience paradise with our oceanfront suites",
    price: 299,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  },
  {
    id: 2,
    title: "Mountain Adventure Tour",
    description: "Guided hiking and camping in the wilderness",
    price: 149,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  },
  {
    id: 3,
    title: "Historic City Tour",
    description: "Discover the secrets of ancient architecture",
    price: 89,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
  },
];
