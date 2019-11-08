package c.eip.navigation.loggedIn.shop


import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.Constants
import c.eip.R
import c.eip.model.Boutique
import c.eip.services.AuthAPI.DataGetter
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfilFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_shop_profil, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val dataGetter = DataGetter()
        val token = dataGetter.getToken(context!!)
        getInfo(token)
        view.findViewById<Button>(R.id.editShopProfil)?.setOnClickListener {
            findNavController().navigate(R.id.shop_edit_profil, null)
        }
    }

    private fun getInfo(token: String?) {
        val call = profilService.getShopProfil(token)
        call.enqueue(object : Callback<Boutique> {
            override fun onResponse(call: Call<Boutique>, response: Response<Boutique>) {
                if (response.isSuccessful) {
                    view?.findViewById<TextView>(R.id.pseudoShop)?.text = response.body()?.pseudo
                    view?.findViewById<TextView>(R.id.emailShop)?.text = response.body()?.email
                    view?.findViewById<TextView>(R.id.phoneShop)?.text = response.body()?.phone
                    view?.findViewById<TextView>(R.id.nomShop)?.text = response.body()?.full_name
                    view?.findViewById<TextView>(R.id.society)?.text = response.body()?.society
                    view?.findViewById<TextView>(R.id.posteShop)?.text = response.body()?.fonction
                    view?.findViewById<TextView>(R.id.villeShop)?.text = response.body()?.city
                    view?.findViewById<TextView>(R.id.postalShop)?.text = response.body()?.postal
                    view?.findViewById<TextView>(R.id.themeShop)?.text = response.body()?.sujet
                    shopData = response.body()
                    Log.i("Information shop", "Success")
                }
            }

            override fun onFailure(call: Call<Boutique>, t: Throwable) {
                Log.e("Information shop erreur", t.message)
            }
        })
    }

    companion object {
        var shopData: Boutique? = Boutique()
        var profilService = Constants.profilService
    }
}
