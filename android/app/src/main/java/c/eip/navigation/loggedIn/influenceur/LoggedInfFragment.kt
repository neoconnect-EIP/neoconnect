package c.eip.navigation.loggedIn.influenceur


import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import c.eip.R

class LoggedInfFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_logged_in_inf, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<Button>(R.id.navigate_influenceur_profile)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_profil, null)
        }
        view.findViewById<Button>(R.id.navigate_influenceur_offer)?.setOnClickListener {
            findNavController().navigate(R.id.influenceur_offer, null)
        }
    }
}
