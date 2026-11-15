import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

const CategoriesCard = () => {
  const categories = [
    'Python',
    'Java',
    'Dart',
    'Flutter',
    'TensorFlow',
    'Keras',
    'PyTorch',
    'OpenCV',
    'Scikit-learn',
    'Pandas',
    'NumPy',
    'Matplotlib'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technologies & Frameworks I Work With</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="grid gap-2">
          {categories.map((category, index) => (
            <Link
              key={index}
              href="#"
              className="flex items-center justify-between text-muted-foreground hover:text-foreground"
            >
              <span>{category}</span>
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default CategoriesCard;