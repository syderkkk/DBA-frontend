import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://france3-regions.francetvinfo.fr/image/TcNtcJPfoa-J9NMuj20Uu6INQQ0/600x400/regions/2020/06/09/5edefb6942289_classcraftgamificationinschool.png" }}>
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Inscribirse como:</h1>
        <div className="grid grid-cols-2 gap-4">
          {/* Opción Maestro */}
          <Link href="/auth/register?role=teacher" className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-2">
              <Image
              src={"/profesor.png"}
              alt="Profesor"
              width={100}
              height={100}
              >
              </Image>
            </div>
            <span className="text-lg font-medium text-gray-700">Maestro</span>
          </Link>
          {/* Opción Alumno */}
          <Link href="/auth/register?role=student" className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-2">
              <Image
              src={"/profesor.png"}
              alt="Profesor"
              width={100}
              height={100}
              >
              </Image>
            </div>
            <span className="text-lg font-medium text-gray-700">Alumno</span>
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Conéctese aquí
          </Link>
        </p>
      </div>
    </div>
  );
}