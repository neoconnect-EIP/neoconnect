package c.eip.navigation.loggedIn.influenceur


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
import c.eip.model.Influenceur
import c.eip.services.AuthAPI
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfilFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_influenceur_profil, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val token = dataGetter.getToken(context!!)
        getInfo(token)
        view.findViewById<Button>(R.id.editInfProfil)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_edit_profil, null)
        }
    }

    private fun getInfo(token: String?) {
        val call = profilService.getInfProfil(token)
        call.enqueue(object : Callback<Influenceur> {
            override fun onResponse(call: Call<Influenceur>, response: Response<Influenceur>) {
                if (response.isSuccessful) {
                    view?.findViewById<TextView>(R.id.pseudoInf)?.text = response.body()?.pseudo
                    view?.findViewById<TextView>(R.id.emailInf)?.text = response.body()?.email
                    view?.findViewById<TextView>(R.id.phoneInf)?.text = response.body()?.phone
                    view?.findViewById<TextView>(R.id.nomInf)?.text = response.body()?.full_name
                    view?.findViewById<TextView>(R.id.facebook)?.text = response.body()?.facebook
                    view?.findViewById<TextView>(R.id.twitterInf)?.text = response.body()?.twitter
                    view?.findViewById<TextView>(R.id.instagramInf)?.text =
                        response.body()?.instagram
                    view?.findViewById<TextView>(R.id.snapchatInf)?.text = response.body()?.snapchat
                    view?.findViewById<TextView>(R.id.villeInf)?.text = response.body()?.city
                    view?.findViewById<TextView>(R.id.postalInf)?.text = response.body()?.postal
                    view?.findViewById<TextView>(R.id.themeInf)?.text = response.body()?.sujet
                    infData = response.body()
                    Log.i("Information shop", "Success")
                }
            }

            override fun onFailure(call: Call<Influenceur>, t: Throwable) {
                Log.e("Information shop erreur", t.message)
            }
        })
    }

    companion object {
        var infData: Influenceur? = Influenceur()
        val dataGetter = AuthAPI.DataGetter()
        var profilService = Constants.profilService
    }
}
