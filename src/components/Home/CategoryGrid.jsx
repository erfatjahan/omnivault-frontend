import { Link } from "react-router-dom";
import { categories } from "../../data/products";

const CategoryGrid = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Shop by Category
        </h2>
        <p className="text-xl text-slate-500 dark:text-rose-200/60 max-w-2xl mx-auto">
          Discover our wide range of products across different categories
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="group glass-card p-6 text-center bg-white/70 dark:bg-[#150d11]/80 border border-slate-200/80 dark:border-white/10 hover:border-[#9c5b6f]/40 dark:hover:border-[#9c5b6f]/40 hover:shadow-lg hover:shadow-[#9c5b6f]/10 transition-all duration-300 rounded-2xl"
          >
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#9c5b6f] dark:group-hover:text-[#e4a8b8] transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;