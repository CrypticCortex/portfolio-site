import React from 'react';

export default function Footer() {
  return (
    <div className='relative h-[400px]' style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}>
      <div className='relative h-[calc(100vh+400px)] -top-[100vh]'>
        <footer className='h-[400px] sticky top-[calc(100vh-400px)] bg-darkBlueLight text-textSecondary py-6'>
          <div className='container mx-auto text-center' style={{paddingTop: '100px'}}>
            <div className='space-y-4'>
              <p> Made with ❤️ on Earth 🌎 </p>
              <p>1234 Imaginary Street, Fictionland, FS, 12345</p>
              <p>Email: kalyanguru18@gmail.com</p>
            </div>
            <div className='mt-4'>
              <div className='mt-4 text-sm text-gray-400'>
                <p> Disclaimer: No actual cats were harmed in the making of our projects. But they might have been mildly annoyed.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
