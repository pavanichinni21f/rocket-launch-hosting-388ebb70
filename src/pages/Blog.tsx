import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const blogPosts = [
  {
    id: 1,
    title: 'How to Choose the Right Web Hosting for Your Business',
    excerpt: 'A comprehensive guide to selecting the perfect hosting solution based on your specific needs and budget.',
    category: 'Guides',
    author: 'Priya Sharma',
    date: '2024-01-15',
    readTime: '8 min read',
    image: '📊',
  },
  {
    id: 2,
    title: 'Top 10 Website Security Best Practices for 2024',
    excerpt: 'Protect your website from cyber threats with these essential security measures every site owner should implement.',
    category: 'Security',
    author: 'Amit Patel',
    date: '2024-01-12',
    readTime: '6 min read',
    image: '🔒',
  },
  {
    id: 3,
    title: 'WordPress Performance Optimization: Complete Guide',
    excerpt: 'Learn how to speed up your WordPress site with these proven optimization techniques and plugins.',
    category: 'WordPress',
    author: 'Sneha Reddy',
    date: '2024-01-10',
    readTime: '10 min read',
    image: '⚡',
  },
  {
    id: 4,
    title: 'Understanding SSL Certificates: A Beginner\'s Guide',
    excerpt: 'Everything you need to know about SSL certificates, why they matter, and how to set them up.',
    category: 'Security',
    author: 'Rajesh Kumar',
    date: '2024-01-08',
    readTime: '5 min read',
    image: '🛡️',
  },
  {
    id: 5,
    title: 'Migrating Your Website: Step-by-Step Tutorial',
    excerpt: 'A complete guide to migrating your website to a new host without downtime or data loss.',
    category: 'Tutorials',
    author: 'Priya Sharma',
    date: '2024-01-05',
    readTime: '12 min read',
    image: '🚀',
  },
  {
    id: 6,
    title: 'Cloud Hosting vs Shared Hosting: Which is Right for You?',
    excerpt: 'Compare the pros and cons of cloud and shared hosting to make an informed decision for your project.',
    category: 'Guides',
    author: 'Amit Patel',
    date: '2024-01-02',
    readTime: '7 min read',
    image: '☁️',
  },
];

const categories = ['All', 'Guides', 'Security', 'WordPress', 'Tutorials'];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Blog & Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hosting <span className="gradient-text-orange">Insights</span> & Tips
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest in web hosting, security tips, and tutorials from our experts.
            </p>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                  <CardHeader className="pb-0">
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center text-5xl mb-4">
                      {post.image}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Load More */}
        <section className="container mx-auto px-4 text-center mb-16">
          <Button variant="outline" size="lg">
            Load More Articles <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </section>

        {/* Newsletter */}
        <section className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-muted-foreground mb-6">
                Get the latest hosting tips and updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border bg-background"
                />
                <Button className="btn-rocket">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
