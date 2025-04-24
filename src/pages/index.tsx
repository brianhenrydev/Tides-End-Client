import Navbar from "@/app/components/Navbar";

 function HomePage() {
  return (
  <div className="font-6xl">
      home
    </div>
  );
}

HomePage.getLayout = function getLayout(page) {
  return (
          <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-grow'>{page}</main>
        </div>

  )
}

export default HomePage
